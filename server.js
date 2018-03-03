var express = require('express');
var morgan = require('morgan');
var path = require('path');
var pool = require('pg').Pool;

var dbconfig={
    user:'jayamanikandan',
    database:'jayamanikandan',
    host:'localhost',
    port:'5432',
    password:process.env.DB_PASSWORD
}

var app = express();
app.use(morgan('combined'));

var articles = 
    {
        'article-one':{
                        title:"Article One | Jayamanikandan",
                        heading:"Article One",
                        date:"Feb 15, 2018",
                        content:`
                        <p>
                            This is the content for my first article. 
                        </p>`},
        'article-two':{
                        title:"Article Two | Jayamanikandan",
                        heading:"Article Two",
                        date:"Feb 20, 2018",
                        content:`
                        <p>
                            This is the content for my second article. This is the content for my second article. 
                        </p>`
        },
        'article-three':{
                        title:"Article Three | Jayamanikandan",
                        heading:"Article Three",
                        date:"Feb 25, 2018",
                        content:`
                        <p>
                            This is the content for my third article. This is the content for my third article. This is the content for my third article. 
                        </p>`
        }
    };

function createTemplate(data)
{
    var title = data.title;
    var heading = data.heading;
    var date = data.date;
    var content = data.content;
    var htmlTemplate=`
        <html>
        <head>
            <title>
                ${title}
            </title>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link href="/ui/style.css" rel="stylesheet" />
        </head>
        <body>
            <div class="container">
                <div>
                    <a href="/">Home</a>
                </div>
                <hr/>
                <h3>
                    ${heading}
                </h3>
                <div>
                    ${date}
                </div>
                ${content}
            </div>
        </body>
    </html>
    `;
    return htmlTemplate;
}

var pool = new pool(dbconfig);
app.get('/test-db', function(req,res)
    {
        //make a select request and
        //return a response with the result
        pool.query('SELECT * FROM test',function(err,result)
            {
                if(err)
                {
                    res.status(500).send(err.toString());
                }
                else
                {
                    res.send(JSON.stringify(result));
                }
            }
        );
    }
);

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});
/*
    ":<parameter name>" is a feature of "Express framework", it will try to match param name with the variable
*/
/*
app.get('/:articleName', function(req,res){
    var articleName = req.params.articleName;
  res.send(createTemplate(articles[articleName]));
}
);*/

app.get('/articles/:articleName', function(req,res){
    pool.query("SELECT * FROM article WHERE title='" + req.params.articleName + "'", function(err,result)
        {
            if(err)
            {
                res.status(500).send(err.toString());
            }
            else
            {
                if(res.rows.length === 0)
                {
                    res.status(404).send("Article NOT found");
                }
                else{
                    var articleData = res.rows[0];
                    res.send(createTemplate(articleData));
                }
            }
        }
    )}
);

app.get('/article-two', function(req,res){
  res.sendFile(path.join(__dirname, 'ui', 'article-two.html'));
}
);

app.get('/article-three', function(req,res){
  res.sendFile(path.join(__dirname, 'ui', 'article-three.html'));
}
);

// Do not change port, otherwise your app won't run on IMAD servers
// Use 8080 only for local development if you already have apache running on 80

var port = 80;
app.listen(port, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
