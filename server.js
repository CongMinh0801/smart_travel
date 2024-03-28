require('dotenv').config();
const { search, book, searchForChange } = require('./booking_api')
const express = require('express')
const cors = require('cors')
const db = require('./db')
const { themBooking } = require('./db-functions')
const { Telegraf } = require('telegraf');

const bot = new Telegraf("6720981968:AAFQlVByeoTlKFXl_WnCTrzww4Raw5R4sZs");

const app = express()
const port = 5000
const baseUrl = "https://apim.dev.vietjetict.com/flight"
const subscriptionKey = "49f11d5cb4164efdb0ea152c39a457c0"
const Authorization = 'Basic QVBJT1RBMDI6VmpldEAxMjM0NQ=='


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.get('/TravelOptions', async (req, res) => {
    const { cityPair, departure, currency, adultCount, childCount, infantCount } = req.query;

    let additionalHeaders;
    try {
        const response = await search(cityPair, departure, currency, adultCount, childCount, infantCount, additionalHeaders);
        if (typeof response === 'object') {
            res.send(response);
        } else {
            console.error('Error: Invalid API response format');
            res.status(500).json({ error: 'Invalid API response format' });
        }
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/travelOptions',async (req, res) => {
    const { cityPair, departure, reservation, journey, currency, adultCount, childCount, infantCount } = req.query;
    
    try {
        const response = await searchForChange(cityPair, departure, reservation, journey, currency, adultCount, childCount, infantCount);
        if (typeof response === 'object') {
            res.send(response);
        } else {
            console.error('Error: Invalid API response format');
            res.status(500).json({ error: 'Invalid API response format' });
        }
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/Airports', (req, res) => {
    var request = require('request');
    var options = {
        "rejectUnauthorized": false,
        'method': 'GET',
        'url': `${baseUrl}/Airports?applicabilityDescriptor=All&includeInactive=false`,
        'headers': {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key': subscriptionKey,
            'Authorization': Authorization,
        }
    };

    request(options, function (error, response) {
        if (error) {
            console.error('Error:', error.message);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }

        let data;
        try {
            data = JSON.parse(response.body);
        } catch (parseError) {
            console.error('Error parsing JSON:', parseError.message);
            res.status(500).json({ error: 'Invalid API response format' });
            return;
        }

        res.setHeader('Content-Type', 'application/json');
        res.send(data);
    });
});


app.get('/Companies', (req, res) => {
    const body = req.body;
    var request = require('request');
    var options = {
        "rejectUnauthorized": false,
        'method': 'GET',
        'url': `${baseUrl}/Companies`,
        'headers': {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key': subscriptionKey,
            'Authorization': Authorization,
        }
    };

    request(options, function (error, response) {
        if (error) {
            console.error('Error:', error.message);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        let data;
        try {
            data = JSON.parse(response.body);
        } catch (parseError) {
            console.error('Error parsing JSON:', parseError.message);
            res.status(500).json({ error: 'Invalid API response format' });
            return;
        }

        res.setHeader('Content-Type', 'application/json');
        res.send(data);
    });
});

app.post('/reservations', async (req, res) => {
    const { adult, child, infant, companyKey, account, journeysBookingCode, contactValue, listAdultAndChild, listInfant, paymentMethod, totalAmount} = req.body;
    let additionalHeaders
    try {
        const response = await book(adult, child, infant, companyKey, account, journeysBookingCode, contactValue, listAdultAndChild, listInfant, paymentMethod, totalAmount, additionalHeaders);

        if (response.locator) {
            themBooking(response)      
        } 
        res.send(response);
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/reservations/paymentTransactions', async (req, res) => {
    var request = require('request');
    let body = req.body.data;
    let reservationKey = req.body.reservationKey; 
    var options = {
      "rejectUnauthorized": false, 
      'method': 'POST',
      'url': `${baseUrl}/reservations/${encodeURI(reservationKey)}/paymentTransactions`,
      'headers': {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key': subscriptionKey,
      },
      'json': body
    };

    console.log(body)
  
    request(options, function (error, response) {
        if (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.setHeader('Content-Type', 'application/json');
        let data
        if (typeof response.body === 'string') {
            data = JSON.parse(response.body);
        } else {
            data = response.body;
        }
        if (data.receiptNumber) {
            db.query(
                'UPDATE booking_info SET payment = 1 WHERE booking_info_key = ?',
                [reservationKey],
                (updateErr, updateResult) => {
                    if (updateErr) {
                        console.error('Error updating payment status:', updateErr);
                        res.status(500).json({ error: 'Internal Server Error' });
                        return;
                    }
                    res.json(data);
                }
            );
        } else {
            res.json(data);
        }
    });
});

//Database
//Lấy danh sách booking
app.get('/bookinginfo', async (req, res) => {
    try {
        const results = await new Promise((resolve, reject) => {
            db.query(`
                SELECT booking_info.*, passengers.*
                FROM booking_info
                LEFT JOIN passengers ON booking_info.booking_info_key = passengers.booking_info_key
            `, (err, results) => {
                if (err) {
                    console.error('Error executing query:', err);
                    reject(err);
                    return;
                }
                resolve(results);
            });
        });

        res.json(results);
    } catch (error) {
        console.error('Error fetching data:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})


bot.use((ctx, next) => {
    if (ctx.message && ctx.message.text) {
        console.log(`Received message: ${ctx.message.text}`);
    } else {
        console.log('Received message without text.');
    }
    next();
});
  
bot.start((ctx) => ctx.replyWithHTML('Hello! I am your Booking BOT.'));

bot.command('search', async (ctx) => {
    const searchData = ctx.message.text.replace('/search', '').trim();
    const listSearchData = searchData.split(" ");
    const currency = "VND";
    let duLieuSai = false
    let cityPair, ngayDi, ngayVe, adultCount=1, childCount=0, infantCount=0;
    
    const headers = {
        'User-Agent': 'Mozilla/5.0 (compatible; DiDobot/1.0; +https://didotek.vn/bot.html)',
    }
    
    const additionalHeaders = headers
    for (const part of listSearchData) {
        if (/^[A-Za-z]{6}$/.test(part)) {
            cityPair = part.slice(0,3) + "-" + part.slice(3,6);
        } else if (/\d{4}/.test(part)) {
            if (!ngayDi) {
                ngayDi = "2024-" + part.slice(2,4) + "-" + part.slice(0,2);
            } else {
                ngayVe = "2024-" + part.slice(2,4) + "-" + part.slice(0,2);
            }
        } else if (/\d+A/.test(part)) {
            adultCount = parseInt(part.slice(0,1));
        } else if (/\d+C/.test(part)) {
            childCount = parseInt(part.slice(0,1));
        } else if (/\d+F/.test(part)) {
            infantCount = parseInt(part.slice(0,1));
        } else {
            duLieuSai = true
        }
    }

    const danhSachSanbay = cityPair?.split("-")

    if(duLieuSai) {
        ctx.replyWithHTML('Dữ liệu truyền vào sai')
    } else if(!ngayDi) {
        ctx.replyWithHTML('Hãy truyền ngày đi')
    } else if(adultCount === 0) {
        ctx.replyWithHTML('Phải có ít nhất một người lớn')
    } else if(infantCount > adultCount) {
        ctx.replyWithHTML('Số lượng người lớn phải nhiều hơn hoặc bằng trẻ em')
    } else if(!cityPair) {
        ctx.replyWithHTML('Hãy truyền sân bay đến và đi');
    } else {
        try {
            const response1 = await search(danhSachSanbay[0]+"-"+danhSachSanbay[1], ngayDi, currency, adultCount.toString(), childCount.toString(), infantCount.toString(), additionalHeaders);
            let response2
            if(ngayVe) {
                response2 = await search(danhSachSanbay[1]+"-"+danhSachSanbay[0], ngayVe, currency, adultCount.toString(), childCount.toString(), infantCount.toString(), additionalHeaders);
            }
            let danhSachChuyenBayDi = []
            if(response1.length > 0) {
                response1.map((item) => {
                    const gioDi = formatTimeString(item.flights[0].departure.localScheduledTime)
                    const gioDen = formatTimeString(item.flights[0].arrival.localScheduledTime)
                    const airlineCode = item.flights[0].airlineCode
                    const flightNumber = item.flights[0].flightNumber
                    let chuyenBayString = `${airlineCode}${flightNumber} <b>${danhSachSanbay[0]}</b>(${gioDi}) - <b>${danhSachSanbay[1]}</b>(${gioDen})\n`
                    item.fareOptions.map((fare)=>{
                        const fareClass = fare.fareClass.description
                        const price = fare.priceAdult
                        chuyenBayString += `${fareClass}: ${price.toLocaleString('vi-VN')}\n`
                    })
                    chuyenBayString += "- - - - - - - - - - - - - - - - - - - - - -"
                    danhSachChuyenBayDi.push(chuyenBayString)
                })
            } else {
                danhSachChuyenBayDi.push("Không tìm thấy chuyến bay")
            }
    
            let danhSachChuyenBayVe = []
            if(response2) {
                if(response2.length > 0) {
                    response2.map((item) => {
                        const gioDi = formatTimeString(item.flights[0].departure.localScheduledTime)
                        const gioDen = formatTimeString(item.flights[0].arrival.localScheduledTime)
                        const airlineCode = item.flights[0].airlineCode
                        const flightNumber = item.flights[0].flightNumber
                        let chuyenBayString = `${airlineCode}${flightNumber} <b>${danhSachSanbay[0]}</b>(${gioDi}) - <b>${danhSachSanbay[1]}</b>(${gioDen})\n`
                        item.fareOptions.map((fare)=>{
                            const fareClass = fare.fareClass.description
                            const price = fare.priceAdult
                            chuyenBayString += `${fareClass}: ${price.toLocaleString('vi-VN')}\n`
                        })
                        chuyenBayString += "- - - - - - - - - - - - - - - - - - - - - -"
                        danhSachChuyenBayVe.push(chuyenBayString)
                    })
                } else {
                    danhSachChuyenBayVe.push("Không tìm thấy chuyến bay")
                }
            }
    
            const textChuyenDi = `<b>+ Chuyến bay đi ngày ${formatDateString(ngayDi)}:</b>\n${danhSachChuyenBayDi.join("\n")}`
            let textChuyenVe = ""
            if(response2) {
                textChuyenVe = `<b>+ Chuyến bay về ngày ${formatDateString(ngayVe)}:</b>\n${danhSachChuyenBayVe.join("\n")}`
            }
    
            const text = `${textChuyenDi}\n\n\n${textChuyenVe}`
    
            function chunkText(text, chunkSize) {
                const chunks = [];
                for (let i = 0; i < text.length; i += chunkSize) {
                    chunks.push(text.slice(i, i + chunkSize));
                }
                return chunks;
            }
    
            const chucks = chunkText(text, 4000)
    
            function chunkAndSend(ctx, chunks, delay) {
                return chunks.reduce((promise, chunk) => {
                    return promise.then(() => {
                        return new Promise((resolve) => {
                            setTimeout(() => {
                                ctx.replyWithHTML(chunk);
                                resolve();
                            }, delay);
                        });
                    });
                }, Promise.resolve());
            }
            
            chunkAndSend(ctx, chucks, 200);
    
        } catch (error) {
            console.error('Error searching:', error.message);
            ctx.replyWithHTML('Có lỗi khi tìm chuyến bay, hãy kiểm tra lại dữ liệu truyền vào');
        }
    }

});

bot.command('book', async (ctx) => {
    const bookData = ctx.message.text.replace('/book', '').trim();
    const listBookData = bookData.split(" ")
    const headers = {
        'User-Agent': 'Mozilla/5.0 (compatible; DiDobot/1.0; +https://didotek.vn/bot.html)',
    }
    const additionalHeaders = headers
    const inputInfoObj = parseBookingInfo(listBookData.join(" "))
    let adult = 1, child = 0, infant = 0
    let adultCount = adult.toString()
    let childCount = child.toString()
    let infantCount = infant.toString()
    const companyKey = "gnt6BDjgabZCjtIaspQrFIHHPScEOLoWn3bHu¥4jGYo="
    const account = {
        "accountNumber": "34000012",
        "creditLimit": 0,
        "creditAvailable": 4998458530.64,
        "currency": {
          "href": "https://vietjet-api.intelisystraining.ca/RESTv1/currencies/USD",
          "code": "USD",
          "description": "US Dollar"
        }
    }
    const contactValue = {
            ho: inputInfoObj.fullName.split(" ")[0],
            ten: inputInfoObj.fullName.split(" ").slice(1).join(" "),
            diDong: "0333333333",
            email: "testemail@gmail.com",
    }

    const listAdultAndChild = [
        {
            ho: inputInfoObj.fullName.split(" ")[0],
            ten: inputInfoObj.fullName.split(" ").slice(1).join(" "),
            ngaySinh: "",
            gioiTinh: inputInfoObj.gender === "Mr" ? "MALE" : "FEMALE",
            title: inputInfoObj.gender,
            number: 1,
            adult: true,
            child: false,
        }
    ]

    const listInfant = []

    try {
        let cityPair = listBookData[0].slice(0,3) + "-" + listBookData[0].slice(3,6)
        const searchResponse = await search(cityPair, "2024-" + listBookData[1].slice(2,4) + "-" + listBookData[1].slice(0,2), "VND", adultCount, childCount, infantCount, additionalHeaders);

        let flight
        searchResponse.map((item) => {
            if (inputInfoObj.flight.slice(2) === item.flights[0].flightNumber) {
                flight = item
            }
        })

        if (!flight) {
            ctx.replyWithHTML(`Chuyến bay ${inputInfoObj.flight} không có trong ngày ${formatDateString("2024-" + listBookData[1].slice(2,4) + "-" + listBookData[1].slice(0,2))}`)
        } else {
            const paymentMethod = inputInfoObj.paymentMethod === "Payment" ? {identifier: "AG", description: "Agency Credit"} : {identifier: "PL", description: "Pay Later"}
            let seletedFare
            flight.fareOptions.map((fare) => {
                if(fare.fareClass.description === inputInfoObj.fareOption){
                    seletedFare = fare
                }
            })

            let totalAmount 
            if(seletedFare) {
                totalAmount = seletedFare.priceAdult
                journeysBookingCode = [seletedFare.bookingCode.key]
                const response = await book(adult, child, infant, companyKey, account, journeysBookingCode, contactValue, listAdultAndChild, listInfant, paymentMethod, totalAmount, additionalHeaders)
                if (response.locator) {
                    themBooking(response)      
                    ctx.replyWithHTML(`Mã đặt vé: ${response.locator}\nTình trạng: ${response.paymentTransactions[0] ? "Đã thanh toán" : "Giữ chỗ"}`)
                }
            } else {
                totalAmount = 0
                ctx.replyWithHTML("Có vấn đề với fareOption truyền vào")
            }
        }

    } catch (error) {
        console.error('Error searching:', error.message);
        ctx.replyWithHTML('Có lỗi khi đặt chuyến bay, hãy kiểm tra lại dữ liệu truyền vào');
    }
});

bot.command('unpaid', async (ctx) => {
    try {
        const results = await new Promise((resolve, reject) => {
            db.query('SELECT locator FROM booking_info WHERE payment = 0 AND DATE_ADD(hold, INTERVAL 7 HOUR) > NOW()', (err, results) => {
                if (err) {
                    console.error('Error executing query:', err);
                    reject(err);
                    return;
                }
                resolve(results);
            });
        });

        let text = "Những vé đặt chỗ chưa thanh toán:\n"
        results.map((item, index) => {
            text += `${index + 1}. ${item.locator}\n`
        })
        
        ctx.replyWithHTML(text)
    } catch (error) {
        console.error('Error fetching unpaid locators:', error);
        ctx.replyWithHTML('Đã xảy ra lỗi khi lấy danh sách mã đặt chỗ chưa thanh toán.');
    }
});

bot.command('payment', async (ctx) => {
    const pnr = ctx.message.text.replace('/payment', '').trim();
    if (pnr.split(" ").length > 1) {
        ctx.replyWithHTML("Thông tin thanh toán sai")
    } else {
        try {
            const results = await new Promise((resolve, reject) => {
                const sql = 'SELECT booking_info_key, charge_journeys_1, charge_journeys_2 FROM booking_info WHERE payment = 0 AND DATE_ADD(hold, INTERVAL 7 HOUR) > NOW() AND locator = ?';
                
                db.query(sql, [pnr], (err, results) => {
                    if (err) {
                        console.error('Error executing query:', err);
                        reject(err);
                        return;
                    }
                    resolve(results);
                });
            });

            let giaChuyenDi = 0
            let giaChuyenVe = 0

            journey1 = JSON.parse(results[0].charge_journeys_1) 
            journey2 = JSON.parse(results[0].charge_journeys_2) 

            journey1.passenger.map((item) => {
                giaChuyenDi += item.totalAmount
            })

            if(journey2) {
                journey2.passenger.map((item) => {
                    giaChuyenVe += item.totalAmount
                })
            }

            const reservationKey = results[0].booking_info_key

            const body = {
                "paymentMethod":{
                   "href":"https: //vietjet-api.intelisystraining.ca/RESTv1/paymentMethods/tfCeB5%C2%A5mircWvs2CC2%A59VaH1zFawFw==",
                   "key":"tfCeB5¥mircWvs2C4HkDdOXNJfƒNFOopDW2yQCBh2p1¥CcncCLQNu3uhZGWzJkJUbmKK13BpWK¥9VaH1zFawFw==",
                   "identifier":"AG",
                   "description":"Agency Credit"
                },
                "paymentMethodCriteria":{
                   "account":{
                      "company":{
                         "key":"gnt6BDjgabZCjtIaspQrFIHHPScEOLoWn3bHu¥4jGYo=",
                         "account":{
                            "accountNumber":"34000012",
                            "creditLimit":0,
                            "creditAvailable":4998457296.61,
                            "currency":{
                               "href":"https://vietjet-api.intelisystraining.ca/RESTv1/currencies/USD",
                               "code":"USD",
                               "description":"US Dollar"
                            }
                         }
                      }
                   }
                },
                "currencyAmounts":[
                   {
                      "totalAmount":giaChuyenDi + giaChuyenVe,
                      "currency":{
                         "code":"VND",
                         "baseCurrency":true
                      },
                      "exchangeRate":1
                   }
                ],
                "processingCurrencyAmounts":[
                   {
                      "totalAmount":0,
                      "currency":{
                         "code":"VND",
                         "baseCurrency":true
                      },
                      "exchangeRate":1
                   }
                ],
                "payerDescription":null,
                "receiptNumber":null,
                "payments":null,
                "refundTransactions":null,
                "notes":null
            }

            var options = {
                "rejectUnauthorized": false, 
                'method': 'POST',
                'url': `${baseUrl}/reservations/${encodeURI(reservationKey)}/paymentTransactions`,
                'headers': {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Ocp-Apim-Subscription-Key': subscriptionKey,
                    'Authorization': Authorization,
                },
                'json': body
            };

            var request = require('request')
            
            request(options, function (error, response) {
                if (error) throw new Error(error);
                let data
                if (typeof response.body === 'string') {
                    data = JSON.parse(response.body);
                } else {
                    data = response.body;
                }

                if (data.receiptNumber) {
                    db.query(
                        'UPDATE booking_info SET payment = 1 WHERE booking_info_key = ?',
                        [reservationKey],
                        (updateErr, updateResult) => {
                            if (updateErr) {
                                console.error('Error updating payment status:', updateErr);
                                res.status(500).json({ error: 'Internal Server Error' });
                                return;
                            }
                        }
                    );
                    ctx.reply("Thanh toán thành công")
                } else {
                    ctx.replyWithHTML("Có lỗi gì đó xảy ra khi thanh toán")
                }
            });
        } catch (error) {
            console.error('Error fetching unpaid locators:', error);
            ctx.replyWithHTML('Đã xảy ra lỗi khi thanh toán.');
        }
    }
});
  
bot.launch().then(() => {
    console.log('Bot has started!');
});

function formatDateString(inputDateString) {
    const inputDate = new Date(inputDateString);
    const day = String(inputDate.getDate()).padStart(2, '0');
    const month = String(inputDate.getMonth() + 1).padStart(2, '0');
    const year = inputDate.getFullYear();

    return `${day}/${month}/${year}`;
}

function formatTimeString(inputTimeString) {
    const inputTime = new Date(inputTimeString);
    const hours = String(inputTime.getHours()).padStart(2, '0');
    const minutes = String(inputTime.getMinutes()).padStart(2, '0');

    return `${hours}:${minutes}`;
}

function parseBookingInfo(inputString) {
    const parts = inputString.split(' ');
    
    let cityPair, date, flight, fareOption, gender, fullName, paymentMethod
    if(parts[parts.length - 1] === "Hold" || parts[parts.length - 1] === "Payment") {
        cityPair = parts[0];
        date = parts[1];
        flight = parts[timIndex(parts, /^[A-Z]{2}\d+$/)];
        fareOption = parts.slice(timIndex(parts, /^[A-Z]{2}\d+$/) + 1, timIndex(parts, /^M[a-z]$/)).join(" ");
        gender = parts[timIndex(parts, /^M[a-z]$/)];
        fullName = parts.slice(timIndex(parts, /^M[a-z]$/) + 1,-1).join(" ");
        paymentMethod = parts[parts.length - 1];
    } else {
        cityPair = parts[0];
        date = parts[1];
        flight = parts[timIndex(parts, /^[A-Z]{2}\d+$/)];
        fareOption = parts.slice(timIndex(parts, /^[A-Z]{2}\d+$/) + 1, timIndex(parts, /^M[a-z]$/)).join(" ");
        gender = parts[timIndex(parts, /^M[a-z]$/)];
        fullName = parts.slice(timIndex(parts, /^M[a-z]$/) + 1).join(" ");
        paymentMethod = "Hold";
    }

    console.log(cityPair,
        date,
        flight,
        fareOption,
        gender,
        fullName,
        paymentMethod)
    return {
        cityPair,
        date,
        flight,
        fareOption,
        gender,
        fullName,
        paymentMethod
    };
}

function timIndex(mangChuoi, regex) {
    for (var i = 0; i < mangChuoi.length; i++) {
        if (regex.test(mangChuoi[i])) {
            return i;
        }
    }
}