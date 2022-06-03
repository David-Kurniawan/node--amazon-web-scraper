const amazonScraper = require('amazon-buddy');
const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.json({ status: 'Success' });
});

app.get('/search', (req, res) => {
    if (!req.query.country) {
        res.status(422).json({ error: 'country is required' });
    }
    if (!req.query.q) {
        res.status(422).json({ error: 'q is required' });
    }
    let goToPage = 1;
    if (req.query.page) {
        goToPage = parseInt(req.query.page)
    }
    (async () => {
        try {
            const products = await amazonScraper.products({ keyword: req.query.q, bulk: false, page: goToPage, country: req.query.country });

            res.json(products);
        } catch (error) {
            console.log(error);
            res.status(422).json({ error: 'Failed to get data' });
        }
    })();
});

app.get('/product', (req, res) => {
    if (!req.query.country) {
        res.status(422).json({ error: 'country is required' });
    }
    if (!req.query.asin) {
        res.status(422).json({ error: 'asin is required' });
    }
    (async () => {
        try {
            const product = await amazonScraper.asin({ asin: req.query.asin, country: req.query.country });

            res.json(product);
        } catch (error) {
            console.log(error);
            res.status(422).json({ error: 'Failed to get data' });
        }
    })();
});

app.get('/review', (req, res) => {
    if (!req.query.country) {
        res.status(422).json({ error: 'country is required' });
    }
    if (!req.query.asin) {
        res.status(422).json({ error: 'asin is required' });
    }
    let totalResult = 50;
    if (req.query.total_result) {
        totalResult = parseInt(req.query.total_result)
    }
    (async () => {
        try {
            const reviews = await amazonScraper.reviews({ asin: req.query.asin, country: req.query.country, number: totalResult});

            res.json(reviews);
        } catch (error) {
            console.log(error);
            res.status(422).json({ error: 'Failed to get data' });
        }
    })();
});

app.listen(port, () => {
  console.log(`Open http://localhost:${port} into your browser`);
});