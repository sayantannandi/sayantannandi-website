"""Verify the preorder gate and build-time page states without payment calls."""
import json
import unittest
from pathlib import Path
from book_page import render_book, validate_order

ROOT = Path(__file__).resolve().parents[1]
TEMPLATE = (ROOT / 'scripts/content/book.html').read_text()


class BookOrderTests(unittest.TestCase):
    def config(self):
        return dict(preorders_open=True, checkout_url='https://checkout.stripe.com/c/book-test',
                    price_label='₹499', format_label='Paperback', dispatch_note='Fixture dispatch date',
                    shipping_note='Fixture shipping details', cancellation_note='Fixture cancellation terms')

    def test_unconfigured_page_does_not_take_orders(self):
        config = json.loads((ROOT / 'scripts/content/book-order.json').read_text())
        config['preorders_open'] = False
        output = render_book(TEMPLATE, config)
        self.assertIn('name="sn-book-interest"', output)
        self.assertIn('action="/book/updates-received"', output)
        self.assertIn('Paid preorders are not open yet', output)
        self.assertNotIn('data-book-checkout', output)
        self.assertNotIn('{{', output)

    def test_paid_checkout_is_available_without_javascript(self):
        config = self.config()
        output = render_book(TEMPLATE, config)
        self.assertIn('href="https://checkout.stripe.com/c/book-test"', output)
        for field in ('price_label', 'format_label', 'dispatch_note', 'shipping_note', 'cancellation_note'):
            self.assertIn(config[field], output)
        self.assertNotIn('data-book-notify', output)
        self.assertNotIn('Preorders opening soon', output)
        self.assertNotIn('{{', output)

    def test_missing_purchase_details_fail_build(self):
        for field in ('checkout_url', 'price_label', 'format_label', 'dispatch_note', 'shipping_note', 'cancellation_note'):
            with self.subTest(field=field):
                config = self.config()
                config[field] = ''
                with self.assertRaises(ValueError):
                    validate_order(config)

    def test_invalid_or_unrelated_checkout_fails_build(self):
        for url in ('javascript:alert(1)', 'http://pay.test/book', 'https://user:password@pay.test/book',
                    'https://example.com/book', 'https://rzp.io/rzp/TSUTSLDec2026', 'https://tagmango.app/68942f6867'):
            with self.subTest(url=url):
                config = self.config()
                config['checkout_url'] = url
                with self.assertRaises(ValueError):
                    validate_order(config)

    def test_purchase_labels_are_escaped(self):
        config = self.config()
        config['shipping_note'] = '<script>alert(1)</script>'
        output = render_book(TEMPLATE, config)
        self.assertIn('&lt;script&gt;', output)
        self.assertNotIn('<script>alert(1)</script>', output)


if __name__ == '__main__':
    unittest.main()
