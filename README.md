# Smart Retail Dashboard System

## Description

The Smart Retail Dashboard System is a web application that helps small shop owners manage their products and track their daily sales. Small businesses often struggle with keeping accurate stock records and monitoring what they sell. This system gives them a simple digital tool that runs in the browser — no internet connection or account required. All data is saved to localStorage so nothing is lost when the page is closed.

## Author

[Chantel]

## Setup Instructions

1. Clone this repository
2. Open `index.html` in your web browser
3. Go to the Inventory page to add your products
4. Go to the Sales page to record a sale
5. All data is automatically saved and retrieved from localStorage

## BDD (Behavior Driven Development)

1. Input: Product name, price, and stock quantity
   - Output: Product card displayed on the Inventory page and saved to localStorage

2. Input: Empty fields on the product form
   - Output: Alert message asking the user to fill in all fields

3. Input: Sale product name and quantity
   - Output: Sale card displayed on the Sales page and saved to localStorage

4. Input: Empty fields on the sales form
   - Output: Alert message asking the user to fill in all fields

5. Input: Contact form with name, email, and message
   - Output: Success message displayed and contact saved to localStorage

6. Input: Empty fields on the contact form
   - Output: Error message displayed in red below the form

## Technologies Used

- HTML
- CSS
- JavaScript

## Known Bugs

- Stock quantity does not reduce automatically when a sale is recorded
- No option to edit a product after it has been added
- Email validation only checks for the `@` symbol

## Contact Information

[nyabokechantel83@gmail.com]
[https://github.com/nyabokechantel83-dev/final-moringa-project]

## License

MIT License

Copyright (c) 2026

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
