
const db = require('./db')

const themBooking = async (data) => {
    // console.log(data)
    let locator = data.locator
            let booking_info_key = data.key
            let number = 141825797
            let contact_Info = {"name":data.bookingInformation.contactInformation.name,
                                "phoneNumber":data.bookingInformation.contactInformation.phoneNumber,
                                "email":data.bookingInformation.contactInformation.email}
                                
            let creation = data.bookingInformation.creation.time
            let hold = data.bookingInformation.hold 
                        ? data.bookingInformation.hold.expiryTime 
                        : null
            let cancellation = data.bookingInformation.cancellation 
                        ? data.bookingInformation.cancellation.time 
                        : null
            let journeys_1 = {  
                                "key":data.journeys[0].key,
                                "flight":{
                                    "key":data.journeys[0].segments[0].flight.key,
                                    "airlineCode":data.journeys[0].segments[0].flight.airlineCode.code,
                                    "flightNumber":data.journeys[0].segments[0].flight.flightNumber,
                                    "aircraftModel":{
                                        "key":data.journeys[0].segments[0].flight.aircraftModel.key,
                                        "name":data.journeys[0].segments[0].flight.aircraftModel.name
                                    }
                                },
                                "departure":{
                                    "localScheduledTime":data.journeys[0].segments[0].departure.localScheduledTime,
                                    "airport":{
                                        "code":data.journeys[0].segments[0].departure.airport.code,
                                        "name":data.journeys[0].segments[0].departure.airport.name
                                    }
                                },
                                "arrival":{
                                    "localScheduledTime":data.journeys[0].segments[0].arrival.localScheduledTime,
                                    "airport":{
                                        "code":data.journeys[0].segments[0].arrival.airport.code,
                                        "name":data.journeys[0].segments[0].arrival.airport.name
                                    }
                                }
                            }
            
            let journeys_2 = data.journeys[1] 
                            ?{  "key":data.journeys[1].key,
                                "flight":{
                                    "key":data.journeys[1].segments[0].flight.key,
                                    "airlineCode":data.journeys[1].segments[0].flight.airlineCode.code,
                                    "flightNumber":data.journeys[1].segments[0].flight.flightNumber,
                                    "aircraftModel":{
                                        "key":data.journeys[1].segments[0].flight.aircraftModel.key,
                                        "name":data.journeys[1].segments[0].flight.aircraftModel.name
                                    }
                                },
                                "departure":{
                                    "localScheduledTime":data.journeys[1].segments[0].departure.localScheduledTime,
                                    "airport":{
                                        "code":data.journeys[1].segments[0].departure.airport.code,
                                        "name":data.journeys[1].segments[0].departure.airport.name
                                    }
                                },
                                "arrival":{
                                    "localScheduledTime":data.journeys[1].segments[0].arrival.localScheduledTime,
                                    "airport":{
                                        "code":data.journeys[1].segments[0].arrival.airport.code,
                                        "name":data.journeys[1].segments[0].arrival.airport.name
                                    }
                                }
                            }
                            : null

            let listPassenger = []
            for (let i = 0; i < data.passengers.length; i++){
                listPassenger = [...listPassenger, data.passengers[i].key]
            }

            let listJourneys = []
            for (let i = 0; i < data.journeys.length; i++){
                listJourneys = [...listJourneys, data.journeys[i].key]
            }

            let passengerTableList = []
            for (let i = 0; i < data.passengers.length; i++){
                let passengerItem = {
                    key: data.passengers[i].key,
                    reservationProfile: {
                        lastName: data.passengers[i].reservationProfile.lastName,
                        firstName: data.passengers[i].reservationProfile.firstName,
                        title: data.passengers[i].reservationProfile.title,
                        gender: data.passengers[i].reservationProfile.gender,
                        birthDate: data.passengers[i].reservationProfile.birthDate,
                        infants: data.passengers[i].infants[0]
                        ?
                        [{
                            key: data.passengers[i].infants[0].key,
                            reservationProfile:data.passengers[i].infants[0].reservationProfile
                        }]
                        :
                        []
                    },
                    fareApplicability: data.passengers[i].fareApplicability
                }
                passengerTableList = [...passengerTableList, passengerItem]
            }

            let charge_journeys_1 = {
                                        "key":listJourneys[0],
                                        "passenger":
                                            listPassenger.map((passenger) => {
                                                let totalAmount = 0
                                                data.charges.map((charge) => {
                                                    if (charge.passenger.key === passenger && charge.journey.key === listJourneys[0]) {
                                                        totalAmount += charge.currencyAmounts[0].totalAmount
                                                    }
                                                })
                                                return {
                                                    "key":passenger,
                                                    "totalAmount": totalAmount
                                                }
                                            })
                                        
                                    }

            let charge_journeys_2 = listJourneys[1] ? {
                                        "key":listJourneys[1],
                                        "passenger":
                                            listPassenger.map((passenger) => {
                                                let totalAmount = 0
                                                data.charges.map((charge) => {
                                                    if (charge.passenger.key === passenger && charge.journey.key === listJourneys[1]) {
                                                        totalAmount += charge.currencyAmounts[0].totalAmount
                                                    }
                                                })
                                                return {
                                                    "key":passenger,
                                                    "totalAmount": totalAmount
                                                }
                                            })
                                        
                                    } : null
            
            let payment = data.paymentTransactions[0] ? 1 : 0

            try {
                const insertResult = await new Promise((resolve, reject) => {
                    const sql = `
                        INSERT INTO booking_info 
                        (\`booking_info_key\`, number, locator, contact_Info, creation, hold, cancellation, journeys_1, journeys_2, charge_journeys_1, charge_journeys_2, payment) 
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    `;
            
                    const values = [
                        booking_info_key,
                        number,
                        locator,
                        JSON.stringify(contact_Info),
                        creation,
                        hold,
                        cancellation,
                        JSON.stringify(journeys_1),
                        JSON.stringify(journeys_2),
                        JSON.stringify(charge_journeys_1),
                        JSON.stringify(charge_journeys_2),
                        payment
                    ];
            
                    db.query(sql, values, (err, results) => {
                        if (err) {
                            console.error('Error executing insert query for booking_info:', err);
                            reject(err);
                            return;
                        }
                        resolve(results);
                    });
                });
                const passengersJson = JSON.stringify(passengerTableList);
                const insertPassengerResult = await new Promise((resolve, reject) => {
                    const sql = `
                        INSERT INTO passengers 
                        (\`booking_info_key\`, passengers) 
                        VALUES (?, ?)
                    `;
            
                    const passengerValues = [booking_info_key, passengersJson];
            
                    db.query(sql, passengerValues, (err, results) => {
                        if (err) {
                            console.error('Error executing insert query for passengers:', err);
                            reject(err);
                            return;
                        }
                        resolve(results);
                    });
                });
            } catch (error) {
                console.error('Error:', error.message);
                console.error('Response:', error.data ? error.data.data : 'No data');
                res.status(500).json({ error: 'Internal Server Error' });
            } 
}

module.exports = { themBooking }