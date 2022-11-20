const app = require("express")();
const db = require("./db.json");
const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const pub = __dirname + '/public';
app.use('/', express.static(pub));

app.get("/index.html", function(req, res) { 
  res.sendFile(pub + '/index.html');
});

app.get("/restclient.html", function(req, res) { 
  res.sendFile(pub + '/restclient.html');
});

app.get("/api/users", (req, res) => {
  res.send(200, db);
});

app.get("/api/users/:id", (req, res) => {
  if (isNaN(req.params.id)) {
    res.send(400, {
      message: "Error: invalid Format.."
    });
  } else {
    const user = db.find(u => u.id == req.params.id); // undefined
    if (user) {
      res.send(200, user);
    } else {
      res.send(404, {
        message: "User inconnu."
      });
    }
  }
});
app.post("/api/users", (req, res) => {
  const willSaveData = {
    id: new Date().getTime(),
    full_name: req.body.full_name,
    country: req.body.country,
    email: req.body.email,
    created_at: new Date()
  };
  db.push(willSaveData);
  res.send(willSaveData);
});
app.patch("/api/users/:id", (req, res) => {
  if (isNaN(req.params.id)) {
    res.send(400, {
      message: "Error: invalid Format."
    });
  } else {
    const user = db.find(u => u.id == req.params.id); // undefined
    if (user) {
      // Kayıt Değişikliği...
      // pass by reference..
      // pass by value..
      Object.keys(req.body).forEach(key => {
        user[key] = req.body[key];
      });
      res.send(200, user);
    } else {
      res.send(404, {
        message: "User non trouvé.."
      });
    }
  }
});
app.delete("/api/users/:id", (req, res) => {
  if (isNaN(req.params.id)) {
    res.send(400, {
      message: "Error: invalid Format ..."
    });
  } else {
    const userIndex = db.findIndex(u => u.id == req.params.id); // undefined
    if (userIndex > -1) {
      db.splice(userIndex, 1);
      res.send(201, {
        message: "User inconnu.."
      });
    } else {
      res.send(404, {
        message: "User non trouvé.."
      });
    }
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Node server running on port 3000 ...");
});
