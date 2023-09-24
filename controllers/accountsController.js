const getData = (req, res, db) => {
  db.select('*').from('accounts')
    .then(items => {
      if (items.length) {
        res.json(items);
      } else {
        res.json({
          dataExists: 'false'
        });
      }
    })
    .catch(err => res.status(400).json({
      dbError: 'error'
    }));
}

const tester = (req, res, db) => {
  db.select('column_name')
    .from('information_schema.columns')
    .where({
      table_name: 'users'
    })
    .then(items => {
      if (items.length) {
        console.log(items);
        res.json(items);
      } else {
        res.json({
          dataExists: 'false'
        });
      }
    })
    .catch(err => res.status(400).json({
      dbError: 'error'
    }));
}

const postUserData = (req, res, db, tname) => {
  // const { fullname, email, phone } = req.body;
  // const date = new Date();
  const sql = "(name, age, passwd) VALUES ('" +
    req.body.uname + "', " +
    req.body.age + ", " +
    "pgp_sym_encrypt('" +
    req.body.password + "','" +
    process.env.SECRET_KEY + req.body.uname + "'))"
  console.log(db(tname).insert(db.raw(sql)).toSQL().sql);
  db(tname).insert(db.raw(sql))
    .returning('*')
    .then(item => {
      res.json(item);
    })
    .catch(err => res.status(400).json({
      dbError: 'Error'
    }));
}

const postData = (req, res, db, tname) => {
  const { fullname, email, phone } = req.body;
  const date = new Date();
  db(tname).insert({ fullname, email, phone, date })
    .returning('*')
    .then(item => {
      res.json(item);
    })
    .catch(err => res.status(400).json({
      dbError: 'Error'
    }));
}


const putData = (req, res, db) => {
  const { id, fullname, email, phone } = req.body;
  db('accounts').where({ id }).update({ fullname, email, phone })
    .returning('*')
    .then(item => {
      res.json(item);
    })
    .catch(err => res.status(400).json({
      dbError: 'Error'
    }));
}

const delData = (req, res, db) => {
  const { id } = req.body;
  db('accounts').where({ id }).del()
    .then(() => {
      res.json({
        delete: 'true'
      });
    })
    .catch(err => res.status(400).json({
      dbError: 'Error'
    }));
}

module.exports = {
  getData,
  postUserData,
  postData,
  putData,
  delData,
  tester
}