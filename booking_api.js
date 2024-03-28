const subscriptionKey = "49f11d5cb4164efdb0ea152c39a457c0"
const baseUrl = "https://apim.dev.vietjetict.com/flight"
const Authorization = 'Basic QVBJT1RBMDI6VmpldEAxMjM0NQ=='

const search = (
    cityPair,
    departure,
    currency,
    adultCount,
    childCount,
    infantCount,
    additionalHeaders
  ) => {
    return new Promise((resolve, reject) => {
      let request = require('request');
      let entries;
      if (additionalHeaders) {
        entries = Object.entries(additionalHeaders);
      }
      let options = {
        "rejectUnauthorized": false,
        'method': 'GET',
        'url': `${baseUrl}/TravelOptions?cityPair=${cityPair}&departure=${departure}&currency=${currency}&adultCount=${adultCount}&childCount=${childCount}&infantCount=${infantCount}`,
        'headers': {
          'Accept': 'application/json',
          'Ocp-Apim-Subscription-Key': subscriptionKey,
        }
      };
  
      if (entries && entries.length > 0) {
        entries.forEach(([key, value]) => {
          options.headers[key] = value;
        });
      }
  
      request(options, function (error, response) {
        if (error) {
          reject(error);
          return;
        }
  
        if (response.headers['content-type'] && response.headers['content-type'].includes('text/html')) {
          reject(new Error('API returned HTML instead of JSON'));
          return;
        }
  
        try {
          const data = JSON.parse(response.body);
          const resData = xuLiDataSearch(data);
          resolve(resData);
        } catch (parseError) {
          reject(parseError);
        }
      });
    });
  };

const searchForChange = (
    cityPair,
    departure,
    reservation,
    journey,
    currency,
    adultCount,
    childCount,
    infantCount
  ) => {
    return new Promise((resolve, reject) => {
      let request = require('request');
      let options = {
        "rejectUnauthorized": false,
        'method': 'GET',
        'url': `${baseUrl}/travelOptions?cityPair=${cityPair}&departure=${departure}&reservation=${reservation}&journey=${journey}&currency=${currency}&adultCount=${adultCount}&childCount=${childCount}&infantCount=${infantCount}`,
        'headers': {
          'Accept': 'application/json',
          'Ocp-Apim-Subscription-Key': subscriptionKey,
        }
      };
  
  
      request(options, function (error, response) {
        if (error) {
          reject(error);
          return;
        }
          const data = JSON.parse(response.body)
          const resData = xuLiDataSearch(data)
          resolve(resData);
      });
    });
  };

//adult là số lượng người lớn

//child là số lượng trẻ em

//infant là số lượng em bé

//companyKey là key của company để thực hiện agency credit

//account là account của company để thực hiện agency credit

//journeysBookingCode là danh sách bookingKey chuyến đi và về 
        //một chuyền [bookingKey]
        //khứ hồi    [bookingKey1, bookingkey2]

//contactValue là thông tin liên lạc
        // contactValue = {
        //     ho: ho,
        //     ten: ten,
        //     diDong: diDong,
        //     email: email,
        // }

//listAdultAndChild là danh sách hành khách gồm người lớn và trẻ em
        // listAdultAndChild = {
        //     ho: "",
        //     ten: "",
        //     ngaySinh: "",
        //     gioiTinh: "",
        //     title: "",
        //     number: 0,
        //     adult: false,
        //     child: false,
        // }

//listInfant là danh sách em bé
        // listInfant = {
        //     ho: "",
        //     ten: "",
        //     ngaySinh: "",
        //     gioiTinh: "",
        //     title: "Infant",
        //     number: 0,
        //     nguoiLon: 0,
        // }

//paymentMethod là thông tin phương thức thanh toán
        // paymentMethod = {
        //     "identifier": "AG",
        //     "description": "Agency Credit"
        // }

//totalAmount là tổng số tiền chuyến đi và chuyến về

const book = (adult, 
            child, 
            infant,
            companyKey,
            account,
            journeysBookingCode,
            contactValue, 
            listAdultAndChild, 
            listInfant,
            paymentMethod, 
            totalAmount,
            additionalHeaders) => {

    for (let i = 0; i < listInfant.length; i++) {
        const index = listInfant[i].adult - 1;
        if (listAdultAndChild[index]) {
            listAdultAndChild[index].infants = listInfant[i];
        }
    }
        
    let passengerJourneyDetailsDi = []
    for (let i = 0; i < listAdultAndChild.length; i++ ) {
        passengerJourneyDetailsDi.push(
            {
                "passenger":{
                    "index":i + 1
                },
                "segment":"",
                "bookingKey": journeysBookingCode[0],
                "reservationStatus":{
                   "confirmed":true,
                   "waitlist":false,
                   "standby":false,
                   "cancelled":false,
                   "open":false,
                   "finalized":false,
                   "external":false
                }
            }
        )
    }
        
    let passengerJourneyDetailsVe = []
    for (let i = 0; i < listAdultAndChild.length; i++ ) {
        passengerJourneyDetailsVe.push(
            {
                "passenger":{
                   "index":i + 1
                },
                "segment":"",
                "bookingKey": journeysBookingCode[1],
                "reservationStatus":{
                   "confirmed":true,
                   "waitlist":false,
                   "standby":false,
                   "cancelled":false,
                   "open":false,
                   "finalized":false,
                   "external":false
                }
            }
        )
    }
        
    const jsonChuyenDi = {
        "index":1,
        "passengerJourneyDetails":passengerJourneyDetailsDi
    }
    
    const jsonChuyenVe = journeysBookingCode[1] ? {
        "index":2,
        "passengerJourneyDetails":passengerJourneyDetailsVe
    }
    : null
        
    const journeys = jsonChuyenVe ? [jsonChuyenDi, jsonChuyenVe] : [jsonChuyenDi]

    let infantIndex = []
    let infantsList = []
    listInfant.map((item, index) => {
        let itemInfant = [
            {
                "index":index + adult + child + 1,
                "reservationProfile":{
                    "lastName": item.ten,
                    "firstName":item.ho,
                    "title":"Infant",
                    "gender":item.gioiTinh,
                    "address":{
                        
                    },
                    "birthDate":item.ngaySinh.split(" ")[0],
                    "personalContactInformation":{
                        "phoneNumber":"",
                        "mobileNumber":"+84" + contactValue?.diDong?.slice(1,10),
                        "email": contactValue?.email
                    }
                }
            }
        ]

        infantsList.push(itemInfant)
        infantIndex.push(item.nguoiLon)
    })
        
    let listPassenger = []
    for (let i = 0; i < listAdultAndChild.length; i++ ) {
        listPassenger.push(
            {
                "index":i+1,
                "fareApplicability":{
                   "child":listAdultAndChild[i].child,
                   "adult":listAdultAndChild[i].adult
                },
                "reservationProfile":{
                   "lastName": listAdultAndChild[i].ten,
                   "firstName":listAdultAndChild[i].ho,
                   "title":listAdultAndChild[i].title,
                   "gender":listAdultAndChild[i].gioiTinh,
                   "address":{
                      
                   },
                   "birthDate":listAdultAndChild[i].ngaySinh,
                   "personalContactInformation":{
                      "phoneNumber":"",
                      "mobileNumber":"+84" + contactValue?.diDong?.slice(1,10),
                      "email": contactValue?.email
                   },
                   "status":{
                      "active":true,
                      "inactive":false,
                      "denied":true
                   }
                },
                "infants": infantIndex.indexOf(i+1) !== -1 ? infantsList[infantIndex.indexOf(i+1)] : []
            }
        )
    }

    const body = {
        "bookingInformation":{
           "contactInformation":{
              "name": contactValue?.ho + " " + contactValue?.ten,
              "phoneNumber":"+84" + contactValue?.diDong?.slice(1,10),
              "extension":"",
              "email": contactValue?.email,
              "language":{
                 "href":"/languages/vi",
                 "code":"vi",
                 "name":"Vietnamese"
              }
           }
        },
        "insurancePolicies":[
           
        ],
        "journeys": journeys,
        "passengers":listPassenger,
        "paymentTransactions": paymentMethod.identifier === 'PL' 
        ? null 
        :[
            {
                "paymentMethod": {
                    "key": "tfCeB5¥mircWvs2C4HkDdOXNJfƒNFOopDW2yQCBh2p1¥CcncCLQNu3uhZGWzJkJUbmKK13BpWK¥9VaH1zFawFw==",
                    "identifier": paymentMethod.identifier,
                    "description": paymentMethod.description
                },
                "paymentMethodCriteria": {
                    "account": {
                        "company": {
                            "key": companyKey,
                            "account": account
                        }
                    }
                },
                "currencyAmounts": [
                    {
                        "totalAmount": totalAmount,
                        "currency": {
                            "code": "VND",
                            "baseCurrency": true
                        },
                        "exchangeRate": 1
                    }
                ],
                "processingCurrencyAmounts": [
                    {
                        "totalAmount": 0,
                        "currency": {
                            "code": "VND",
                            "baseCurrency": true
                        },
                        "exchangeRate": 1
                    }
                ],
                "payerDescription": null,
                "receiptNumber": null,
                "payments": null,
                "refundTransactions": null,
                "notes": null
            }
        ],
        "ancillaryPurchases":[
           
        ],
        "seatSelections":[
           
        ]
    }

    console.log(JSON.stringify(body))

    return new Promise((resolve, reject) => {
        var request = require('request');
        var options = {
            "rejectUnauthorized": false,
            'method': 'POST',
            'url': `${baseUrl}/reservations`,
            'headers': {
                'Accept': 'application/json',
                'Ocp-Apim-Subscription-Key': subscriptionKey,
                'Authorization': Authorization
            },
            'json': body
        };

        request(options, function (error, response, responseBody) {
            if (error) {
                reject(error);
                return;
            }

            if (response.statusCode >= 200 && response.statusCode < 300) {
                resolve(responseBody);
            } else {
                const errorMessage = responseBody?.error?.message || `Request failed with status code ${response.statusCode} \n ${JSON.stringify(response)}`;
                reject(new Error(errorMessage));
            }
        });
    });
};

function xuLiDataSearch (data) {
    let resData = [];
        
        for (let i = 0; i < data.length; i++){
            let flightCount = data[i].flights.length
            let flightList = []
            for(let j = 0; j < flightCount; j++) {
                let flight = {
                    flightNumber: data[i].flights[j].flightNumber,
                    departure: {
                        airportName: data[i].flights[j].departure.airport.name,
                        airportCode: data[i].flights[j].departure.airport.code,
                        utcOffset: data[i].flights[j].departure.airport.utcOffset,
                        scheduledTime: data[i].flights[j].departure.scheduledTime,
                        localScheduledTime: data[i].flights[j].departure.localScheduledTime
                    },
                    arrival: {
                        airportName: data[i].flights[j].arrival.airport.name,
                        airportCode: data[i].flights[j].arrival.airport.code,
                        utcOffset: data[i].flights[j].arrival.airport.utcOffset,
                        scheduledTime: data[i].flights[j].arrival.scheduledTime,
                        localScheduledTime: data[i].flights[j].arrival.localScheduledTime
                    },
                    airlineCode: data[i].flights[j].airlineCode.code,
                    aircraftModel: {
                        name: data[i].flights[j].aircraftModel.name,
                        identifier: data[i].flights[j].aircraftModel.identifier,
                    }
                }
                flightList = [...flightList, flight]
            }

            let fareOptions = []
            const optionsCount = data[i].fareOptions.length
            for (let j = 0; j < optionsCount; j++){
                let priceAdult = 0
                let priceChild = 0
                let priceInfant = 0
                for(let k = 0; k < data[i].fareOptions[j].fareCharges.length; k++) {
                    if (data[i].fareOptions[j].fareCharges[k].chargeType.code != "SA") {
                        if (data[i].fareOptions[j].fareCharges[k].passengerApplicability.adult) {
                            priceAdult += data[i].fareOptions[j].fareCharges[k].currencyAmounts[0].totalAmount
                        }
                        if (data[i].fareOptions[j].fareCharges[k].passengerApplicability.child) {
                            priceChild += data[i].fareOptions[j].fareCharges[k].currencyAmounts[0].totalAmount
                        }
                        if (data[i].fareOptions[j].fareCharges[k].passengerApplicability.infant) {
                            priceInfant += data[i].fareOptions[j].fareCharges[k].currencyAmounts[0].totalAmount
                        }
                    }
                }

                let option = {
                    bookingCode: {
                        code: data[i].fareOptions[j].bookingCode.code,
                        description: data[i].fareOptions[j].bookingCode.description,
                        key: data[i].fareOptions[j].bookingKey
                    }, 
                    cabinClass: {
                        code: data[i].fareOptions[j].cabinClass.code,
                        description: data[i].fareOptions[j].cabinClass.description,
                    },
                    fareClass: {
                        code: data[i].fareOptions[j].fareClass.code,
                        description: data[i].fareOptions[j].fareClass.description,
                    },
                    priceAdult: priceAdult,
                    priceChild: priceChild,
                    priceInfant: priceInfant,
                }

                fareOptions = [...fareOptions, option]
            }

            let item = {
                flights: flightList,
                numberOfStops: data[i].numberOfStops,
                numberOfChanges: data[i].numberOfChanges,
                fareOptions: fareOptions,
            }
            resData = [...resData, item];
        }
    return resData
}

module.exports = { search, book, searchForChange };
