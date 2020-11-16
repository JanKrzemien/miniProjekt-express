var express = require("express")
var app = express()
const PORT = 3000;

var path = require("path");
var bodyParser = require("body-parser");

app.use(express.static('static'));
app.use(bodyParser.urlencoded({ extended: true }));

let users = [
    {
        id: 1,
        nick: "anna",
        pass: "pass1",
        wiek: 12,
        uczen: undefined,
        plec: 'k'
    },
    {
        id: 2,
        nick: "marcel",
        pass: "pass2",
        wiek: 16,
        uczen: 'true',
        plec: 'm'
    },
    {
        id: 3,
        nick: "pies",
        pass: "pass3",
        wiek: 6,
        uczen: 'true',
        plec: 'm'
    }
];

let posortowanaTablica = users;
let sortowanie = 'mal';

let zalogowany = false;

// main
app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname + "/static/main.html"))
})

//register
app.get("/register", function (req, res) {
    res.sendFile(path.join(__dirname + "/static/register.html"))
});
app.post("/register", function (req, res) {
    let zajetyNick = false;

    for (let i = 0; i < users.length; i++) {
        if (users[i].nick == req.body.nick) {
            zajetyNick = true;
        }
    }

    if (zajetyNick) {
        res.send("login jest zajęty");
    } else {
        let doTablicy = { id: users.length + 1, nick: req.body.nick, pass: req.body.password, wiek: req.body.wiek, uczen: req.body.uczen, plec: req.body.plec };
        users.push(doTablicy);
        res.send("witaj " + req.body.nick + " zostałeś dodany do bazy danych");
        console.log(doTablicy);
    }
});

//login
app.get("/login", function (req, res) {
    res.sendFile(path.join(__dirname + "/static/login.html"))
})
app.post("/login", function (req, res) {
    for (let i = 0; i < users.length; i++) {
        if (users[i].nick == req.body.nick && users[i].pass == req.body.password) {
            zalogowany = true;
            res.redirect("/admin");
        }
    }
})

//admin
app.get("/admin", function (req, res) {
    if (zalogowany) {
        res.sendFile(path.join(__dirname + "/static/admin+.html"))
    } else {
        res.sendFile(path.join(__dirname + "/static/admin.html"))
    }
})

//logout
app.get("/logout", function (req, res) {
    if (zalogowany) {
        zalogowany = false;
        res.redirect("/");
    } else {
        res.sendFile(path.join(__dirname + "/static/else.html"));
    }
});

//sort
app.get("/sort", function (req, res) {
    if (zalogowany) {
        posortowanaTablica = posortowanaTablica.sort(function (a, b) {
            return parseFloat(a.wiek) - parseFloat(b.wiek);
        });

        let toSend = `<body style="background: #38372b; color: white"><a href="sort" style="color: white; margin-left: 15px">sort</a><a href="gender" style="color: white; margin-left: 15px">gender</a><a href="show" style="color: white; margin-left: 15px">show</a>`;

        toSend += `<form action="/sort" method="post" onchange="this.submit()">`;

        if (sortowanie == 'ros') {
            toSend += `malejąco: <input type="radio" name="sortowanie" value="mal"> rosnąco: <input type="radio" name="sortowanie" checked value="ros">`;

            toSend += `<table style="border: none">`
            for (let i = 0; i < posortowanaTablica.length; i++) {
                toSend += `<tr style="border: none">`
                toSend += `<td style="border: 1px solid yellow; height: 35px; width: 200px; text-align: center">id: ` + posortowanaTablica[i].id + `</td>`;
                toSend += `<td style="border: 1px solid yellow; height: 35px; width: 200px; text-align: center">user: ` + posortowanaTablica[i].nick + ' - ' + users[i].pass + `</td>`;
                toSend += `<td style="border: 1px solid yellow; height: 35px; width: 200px; text-align: center">wiek: ` + posortowanaTablica[i].wiek + `</td>`;
                toSend += "</tr>"
            }
        } else if (sortowanie == 'mal') {
            toSend += `malejąco: <input type="radio" name="sortowanie" checked value="mal"> rosnąco: <input type="radio" name="sortowanie" value="ros">`;

            toSend += `<table style="border: none">`
            for (let i = posortowanaTablica.length - 1; i >= 0; i--) {
                toSend += `<tr style="border: none">`
                toSend += `<td style="border: 1px solid yellow; height: 35px; width: 200px; text-align: center">id: ` + posortowanaTablica[i].id + `</td>`;
                toSend += `<td style="border: 1px solid yellow; height: 35px; width: 200px; text-align: center">user: ` + posortowanaTablica[i].nick + ' - ' + users[i].pass + `</td>`;
                toSend += `<td style="border: 1px solid yellow; height: 35px; width: 200px; text-align: center">wiek: ` + posortowanaTablica[i].wiek + `</td>`;
                toSend += "</tr>"
            }
        }

        toSend += "</table></body>";
        res.send(toSend);
    } else {
        res.sendFile(path.join(__dirname + "/static/admin.html"));
    }
});
app.post('/sort', function (req, res) {
    if (req.body.sortowanie == 'ros') {
        sortowanie = 'ros';
    } else if (req.body.sortowanie == 'mal') {
        sortowanie = 'mal';
    }
    res.redirect('/sort');
});

//show
app.get("/show", function (req, res) {
    if (zalogowany) {
        let toSend = `<body style="background: #38372b; color: white"><a href="sort" style="color: white; margin-left: 15px">sort</a><a href="gender" style="color: white; margin-left: 15px">gender</a><a href="show" style="color: white; margin-left: 15px">show</a>`;
        toSend += `<table style="border: none">`
        for (let i = 0; i < users.length; i++) {
            toSend += `<tr style="border: none">`
            for (let j = 0; j < 5; j++) {
                if (j == 0) {
                    toSend += `<td style="border: 1px solid yellow; height: 35px; width: 200px; text-align: center">id: ` + users[i].id + `</td>`;
                } else if (j == 1) {
                    toSend += `<td style="border: 1px solid yellow; height: 35px; width: 200px; text-align: center">user: ` + users[i].nick + " - " + users[i].pass + `</td>`;
                } else if (j == 2) {
                    if (users[i].uczen == 'true') {
                        toSend += `<td style="border: 1px solid yellow; height: 35px; width: 200px; text-align: center">uczeń: <input type="checkbox" checked disabled></td>`;
                    } else {
                        toSend += `<td style="border: 1px solid yellow; height: 35px; width: 200px; text-align: center">uczeń: <input type="checkbox" unchecked disabled></td>`;
                    }
                } else if (j == 3) {
                    toSend += `<td style="border: 1px solid yellow; height: 35px; width: 200px; text-align: center">wiek: ` + users[i].wiek + `</td>`;
                } else if (j == 4) {
                    toSend += `<td style="border: 1px solid yellow; height: 35px; width: 200px; text-align: center">płeć: ` + users[i].plec + `</td>`;
                }
            }
            toSend += "</tr>"
        }
        toSend += "</table></body>";
        res.send(toSend);
    } else {
        res.sendFile(path.join(__dirname + "/static/admin.html"));
    }
})

//gender
app.get("/gender", function (req, res) {
    if (zalogowany) {
        let toSend = `<body style="background: #38372b; color: white"><a href="sort" style="color: white; margin-left: 15px">sort</a><a href="gender" style="color: white; margin-left: 15px">gender</a><a href="show" style="color: white; margin-left: 15px">show</a>`;
        toSend += `<table style="border: none">`
        for (let i = 0; i < users.length; i++) {
            if (users[i].plec == 'k') {
                toSend += `<tr style="border: none">`
                toSend += `<td style="border: 1px solid yellow; height: 35px; width: 200px; text-align: center">id: ` + users[i].id + `</td>`;
                toSend += `<td style="border: 1px solid yellow; height: 35px; width: 200px; text-align: center">płeć: ` + users[i].plec + `</td>`;
                toSend += "</tr>"
            }
        }
        toSend += "</table></br>";
        toSend += `<table style="border: none">`
        for (let i = 0; i < users.length; i++) {
            if (users[i].plec == 'm') {
                toSend += `<tr style="border: none">`
                toSend += `<td style="border: 1px solid yellow; height: 35px; width: 200px; text-align: center">id: ` + users[i].id + `</td>`;
                toSend += `<td style="border: 1px solid yellow; height: 35px; width: 200px; text-align: center">płeć: ` + users[i].plec + `</td>`;
                toSend += "</tr>"
            }
        }
        toSend += "</table></body>";
        res.send(toSend);
    } else {
        res.sendFile(path.join(__dirname + "/static/admin.html"));
    }
})

app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname + "/static/else.html"));
})

//nasłuch na określonym porcie

app.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT)
})