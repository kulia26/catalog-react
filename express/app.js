'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const User = require('./user');
const Item = require('./item');
const key = require('./key');

const cors = require('cors');

const multer  = require('multer');
const path = require('path');
const crypto = require('crypto');
const fs = require('fs');


function checksum(str, algorithm, encoding) {
  return crypto
    .createHash(algorithm || 'sha1')
    .update(str, 'utf8')
    .digest(encoding || 'hex');
}

const categories = {
  'laptops': 'Ноутбуки',
  'tablets': 'Планшети',
  'smartphones': 'Смартфони',
  'keyboards': 'Клавіатури',
  'mouses': 'Мишки',
  'headphones': 'Навушники',
  'players': 'Плеєри',
};

const storage = multer.memoryStorage();

const upload = multer({ storage });


//var usersRouter = require('./routes/users');

const API_PORT = 8081;
const app = express();

app.use(logger('dev'));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));

mongoose.connect('mongodb://localhost/catalog', { useNewUrlParser: true });
//mongoose.connect('mongodb://localhost/catalog', { useNewUrlParser: true }, () =>  mongoose.connection.db.dropDatabase());

const saveImage = (req) => {
  const ext = path.extname(req.file.originalname);
  const sum  = checksum(req.file.originalname + req.file.size + Date.now());
  const fileName =  sum + ext;
  fs.writeFile('./public/images/' + fileName, req.file.buffer, (err) => {
    if (err) throw err;
  });
  return 'http://localhost:8081/images/' + fileName;
};


app.use((req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    console.log(token);
    jwt.verify(token, key.tokenKey, (err, payload) => {
      console.log(payload);
      if (payload) {
        User.findOne({ email: payload.email }).then(
          (doc) => {
            req.user = doc;
            next();
          }
        ).catch((err) => {
          req.user = {};
        });
      } else {
        req.user = {};
        next();
      }
    });
  } catch (e) {
    req.user = {};
    next();
  }
});

app.post('/login', (req, res) => {
  User.findOne({ email: req.body.email }).then((user) => {
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (isMatch) {
        const token = jwt.sign(user.toJSON(), key.tokenKey, { expiresIn: 60 * 60 * 24 });
        res.status(200).json({
          user: {
            userId: user.id,
            name: user.name,
            image: user.image,
            email: user.email,
            isAdmin: user.isAdmin,
            token,
          },
          message: 'Вітаємо, ' + user.name,
        });
      } else {
        res.status(200).json({ message: 'Перевірте правильність вводу даних', user: '' });
      }
    });
  }).catch((err) => {
    res.status(200).json({ message: 'Такого користувача не існує', user: '' });
  });
});

app.post('/register',  upload.single('image'), (req, res) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (user !== null) {
        res
          .status(200)
          .json({ message: 'Користувач з цією адресою вже зареєстрований' });
      } else {
        const fileName = saveImage(req);
        console.log(fileName);
        User
          .create(new User({ name: req.body.name, email: req.body.email, password: req.body.password, image: fileName, isAdmin: false }))
          .then((user) => {
            const token = jwt.sign(user.toJSON(), key.tokenKey);
            res.status(200).json({
              user: {
                userId: user.id,
                name: user.name,
                image: user.image,
                email: user.email,
                token,
              },
              message: 'Ви успішно зареєструвалися',
            });
          })
          .catch((err) => {
            res.status(200).json({ message: 'Не вдалося створити користувача' + err.message });
          });
      }
    }).catch((err) => {
      res.status(200).json({ message: 'Проблеми з базою даних' + err.message });
    });

});

app.get('/getItems/:number', (req, res) => {
  /*Item.create(new Item(
    { name: 'MacBook Pro mid 2013',
      description: 'the best mac ever.',
      image: 'http://localhost:8081/images/mac.png',
      category: 'laptops',
    }
  ));*/
  //Item.deleteMany({ name: /MacBook Pro mid 2013/ }, () => {});
  const param = req.params.number;
  const details = {};
  if (Object.keys(categories).includes(param)) {
    details.category = param;
  }
  Item.find(details, (err, docs) => {
    if (err) res.status(400).json({ message: err.message });
    res.status(200).json(JSON.stringify(docs));
  });
});

app.post('/addItem',  upload.single('image'), (req, res) => {
  if (req.user.isAdmin && req.user) {
    const fileName = saveImage(req);
    const details = {
      name: req.body.name,
      description: req.body.description,
      image: fileName,
      category: req.body.category,
      addedBy: req.user._id,
    };
    const it = Item.create(new Item(details));
    res.status(200).json({ message: 'Ви успішно додали товар', item: it });
  } else {
    res.status(401).json({ message: 'Помилка доступу', user: '' });
  }
});

app.post('/deleteItem/:number', (req, res) => {
  if (req.user.isAdmin) {
    const param = req.params.number;
    Item.deleteMany({ _id: param }, () => {
      res.status(200).json({ message: 'Ви успішно додали товар' });
    }).catch((err) => {
      res.status(400).json({ message: 'Помилка при видаленні' });
    });
  } else {
    res.status(401).json({ message: 'Помилка доступу' });
  }
});

app.post('/updateItem/:id',  upload.single('image'), (req, res) => {
  if (req.user.isAdmin && req.user) {
    const fileName = saveImage(req);
    const details = {
      name: req.body.name,
      description: req.body.description,
      image: fileName,
      category: req.body.category,
      addedBy: req.user._id,
    };
    const id = req.params.id;
    Item.findOne({ _id: id }, (err, item) => {
      item.name = details.name;
      item.description = details.description;
      item.image = details.image;
      item.category = details.category;
      item.save();
    });
    res.status(200).json({ message: 'Ви успішно відредагували товар' });
  } else {
    res.status(401).json({ message: 'Помилка доступу', user: '' });
  }
});

app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));
module.exports = app;
