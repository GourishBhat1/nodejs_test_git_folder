const express = require('express')
const bodyParser = require('body-parser')
const mysql = require('mysql')
const Connection = require('mysql/lib/Connection')

// for storing values in sessions
var session = require('express-session');


const app = express()


// setting session 
app.use(session({resave: false, saveUninitialized: false, secret: 'XCR3rsasa%RDHHH', cookie: { maxAge: 60000 }}));



const Port = process.env.PORT || 8000

app.use(bodyParser.urlencoded({extended: false }))

app.use(bodyParser.json())


//mysql
const pool = mysql.createPool({
    connectionLimit : 10,
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'scanner_db'
})

//to get all the data
app.get('', (req, res) => {
    pool.getConnection((err, Connection) => {
        if(err) throw err
        console.log(`connected as id ${Connection.threadId}`)

        Connection.query('select * from login_app', (err, rows) =>{
            Connection.release()

            if(!err){
                res.send(rows)
                console.log(rows)

            } else {
                console.log(err)
            }
        })
    })
})


//to get all the data with unique id
app.get('/:id', (req, res) => {
    pool.getConnection((err, Connection) => {
        if(err) throw err
        console.log(`connected as id ${Connection.threadId}`)

        Connection.query('select * from login_app WHERE id = ?', [req.params.id], (err, rows) =>{
            Connection.release()

            if(!err){
                res.send(rows)
                console.log(rows)

            } else {
                console.log(err)
            }
        })
    })
})


//to delete unique data from record
app.delete('/:id', (req, res) => {
    pool.getConnection((err, Connection) => {
        if(err) throw err
        console.log(`connected as id ${Connection.threadId}`)

        Connection.query('DELETE from login_app WHERE id = ?', [req.params.id], (err, rows) =>{
            Connection.release()

            if(!err){
                res.send(`Record from scanner db login table with ID: ${[req.params.id]} has been removed`)
                console.log(rows)

            } else {
                console.log(err)
            }
        })
    })
})



//to insert data from record
app.post('', (req, res) => {
    pool.getConnection((err, Connection) => {
        if(err) throw err
        console.log(`connected as id ${Connection.threadId}`)

        const params = req.body

        Connection.query('INSERT INTO login_app SET ?', params , (err, rows) =>{
            Connection.release()

            if(!err){
                res.send(`Record from scanner db login table added `)
                console.log(rows)

            } else {
                console.log(err)
            }
        })
    })
})

//to update data from record
app.put('', (req, res) => {
    pool.getConnection((err, Connection) => {
        if(err) throw err
        console.log(`connected as id ${Connection.threadId}`)

        const {id, username, password, status } = req.body

        Connection.query('UPDATE login_app SET username = ?, password = ?, status = ? WHERE id = ?', [username, password, status, id] , (err, rows) =>{
            Connection.release()

            if(!err){
                res.send(`Record from scanner db login table updated id: ${[username]} `)
                console.log(rows)

            } else {
                console.log(err)
            }
        })
    })
})


// check for user present in db
//to insert data from record
app.post('/check_user', (req, res) => {
    pool.getConnection((err, Connection) => {
        if(err) throw err
        console.log(`connected as id ${Connection.threadId}`)

        const {username, password, device_uinique_id} = req.body
        console.log(username)
        console.log(password)
        console.log(device_uinique_id)

      
        
        let row_id;
        let row_password;
        let row_username;

        
        

        Connection.query('SELECT * FROM login_app WHERE username = ?', [username] , (err, rows) =>{
            if(err){
                console.log(err)
            }
            
            // Connection.release()

            if(rows.length > 0){
                // console.log(rows);

                

                Object.keys(rows).forEach(function(key){

                    // data from db
                    let login_data_rows = rows[key];
                    row_id = login_data_rows.id
                    row_username = login_data_rows.username
                    row_password = login_data_rows.password
                    row_status = login_data_rows.status
                    no_of_devices = login_data_rows.no_devices
                    vendor_code = login_data_rows.vendor_code

                    // console.log(login_data_rows);
                    console.log('data from user')

                    console.log(login_data_rows);


                    console.log('user values from user')
                    console.log(username)
                    console.log(password)
                    console.log(device_uinique_id)
                    console.log('\n')

                    console.log('user values from db')
                    console.log(row_username)
                    console.log(row_password)
                    console.log(row_status)
                    console.log(no_of_devices)
                    console.log(vendor_code)

                    console.log('\n')

                    session=req.session;
                    session.userid=username;

                    session.status_value=row_status;
                    session.user_password=password;

                    session.no_of_devices_value=no_of_devices;
                    session.vendor_code_value=vendor_code;

                    console.log('user name from session is')

                    console.log(session.userid)
                    console.log(session.user_password)
                    console.log(session.status_value)
                    console.log(session.no_of_devices_value)
                    console.log('\n')

                    // console.log('output of above using keys')
                    // console.log(login_data_rows);
                });

                if(session.status_value == '1'){
                    const userexists = '1';
                    session.userexists = userexists;
                    let status = '1';

                    console.log(session.userexists)

                    session.status_value_db = status;
                    console.log('user is active')
                    console.log(session.userexists)
                    

                }
                else{
                    console.log('user is disabled by admin')
                    session.destroy();
                }

                // let reformattedArray = rows.map(obj => {
                //     let rObj = {}
                //     rObj[obj.key] = obj.value
                //     return rObj
                //  });

                //  console.log(reformattedArray)

                // Connection.query('SELECT * FROM login_app WHERE username = ? AND password = ?', [username, password], (err, rows) =>{
                //     if(err){
                //         console.log(err)
                //     }

                //     if(rows.length > 0)
                //     {
                //         res.send('username and password matched') 
                //     }
                //     else{
                //         res.send('password invalid. please try again') 
                //     }
                // })

                // console.log(row_username);
                // console.log(row_id);
                console.log("\n");
                // //const myJSON1 = JSON.stringify(rows);
                // const myJSON = JSON.parse(rows);
                // console.log(myJSON["id"]);
                // console.log(myJSON.id)

               
               
               
                // console.log(`Record with => ${[username]}  exits`)
                // res.send(`Record with => ${[username]}  exits`)


            }
            else{
                console.log('username invalid. please try again')
                req.session.destroy();
                // res.send('username invalid. please try again') 
            }

            // if(!err){
            //     res.send(`Record from scanner db login table added `)
            //     console.log(rows)

            // } else {
            //     console.log(err)
            // }

            console.log('ppppppp')
            console.log(session.userexists)


            if((session.userexists == '1'))
        {
              Connection.query('SELECT * FROM login_app WHERE username = ? AND password = ?', [username, password], (err, rows) =>{
                    if(err){
                        console.log(err)
                    }

                    // Connection.release()

                    if(rows.length > 0)
                    {
                        console.log('username and password matched')

                        //if username and password matched check for no of devices and uniqueness
                        //if numbder of devices is 0
                        if(session.no_of_devices_value == '0')
                        {

                            console.log(session.vendor_code_value)
                            const vendor_code_now = session.vendor_code_value
                            Connection.query('SELECT * FROM link_device_app WHERE vendor_code = ?  AND device_unique_id = ?', [vendor_code_now, device_uinique_id], (err, rows1) =>{
                                if(err){
                                    console.log(err)
                                }
            
                                Connection.release()

                                console.log(rows1)

                                // check if user device is active
                                Object.keys(rows1).forEach(function(key){

                                    // data from db
                                    let user_device_active = rows1[key];
                                    device_status_value_db = user_device_active.device_status
                                    
                
                                    // console.log(login_data_rows);
                                    console.log('data from user')
                                    console.log(device_status_value_db)
                
                              
                                });


                                if(rows1.length > 0)
                                {
                                    console.log('device exits')
                                        // swicth case for teh value
                                    switch (device_status_value_db) {
                                        case 1:
                                            console.log(' device is active');
                                            console.log(' allow login to user');
                                                
                                        break;
                                        case 2:
                                            console.log('vendor on grace period');
                                            console.log(' allow login to user');
                                        break;
                                        // case 3:
                                        //     console.log('registration of device initialised');
                                        // break;
                                        default:
                                        console.log(err);
                                    }


                                    // switch case end
                                }
                                else{
                                    console.log('device dosent exist')
                                    console.log('logout')
                                                
                                }




                                






                                // if(rows1.length > 0)
                                // {
                                //     console.log('device exits')
                                // }
                                // else{
                                //     console.log('device dosent exist')
                                    
                                // }
            
                                
                            });

                        }
                        //if number of devices is greater then 0
                        else if(session.no_of_devices_value > '0'){

                            console.log(session.vendor_code_value)
                            const vendor_having_devices_to_register = session.vendor_code_value
                            Connection.query('SELECT * FROM link_device_app WHERE vendor_code = ?  AND device_unique_id = ?', [vendor_having_devices_to_register, device_uinique_id], (err, rows2) =>{
                                if(err){
                                    console.log(err)
                                }
            
                                Connection.release()

                                console.log(rows2)

                                // check if user device is active
                                Object.keys(rows2).forEach(function(key){

                                    // data from db
                                    let user_device_active = rows2[key];
                                    device_status_value_db = user_device_active.device_status
                                    
                
                                    // console.log(login_data_rows);
                                    console.log('data from user')
                                    console.log(device_status_value_db)
                
                              
                                });

                                if(rows2.length > 0)
                                {
                                    console.log('device already present allow login')
                                }
                                else{

                                    console.log('device not present and direct to resgister page')

                                }





            
                                
                            });


                        }


                        //if username and password matched check for no of devices and uniqueness

                        session.destroy();
                        // res.send('username and password matched') 
                    }
                    else{
                        console.log('password invalid. please try again') 
                        session.destroy();
                    }
                });
        }


        });

        console.log('user exixts session value')
        console.log(session.userexists)

        
        
    })
})

// checking for user present in db



// var sessionData;
// app.get('/set_session',function(req,res){
//   sessionData = req.session;
//   sessionData.user = {};
//   let username = "adam";
//   sessionData.user.username = username;
//   sessionData.user.salary = random.int(55, 956);
//    console.log("Setting session data:username=%s and salary=%s", username, sessionData.user.salary)
 
//    console.log(sessionData.user.salary);
//    console.log('hi')
//  // res.end('Saved session and salary : ' + sessionData.username);
//  res.json(sessionData.user)
// });



// 1
// 2
// 3
// 4
// 5
// 6
// 7
// 8
// app.get('/get_session',function(req,res){
//   sessionData = req.session;
//   let userObj = {};
//   if(sessionData.user) {
//      userObj = sessionData.user;
//   }
//   res.json(userObj)
// });





//to link a device
app.post('/link_device', (req, res) => {
    pool.getConnection((err, Connection) => {
        if(err) throw err
        console.log(`connected as id ${Connection.threadId}`)

        const {vendor_code_frm_ui, device_unique_id_frm_ui, qr_data_frm_ui, device_name_frm_ui} = req.body

        console.log(vendor_code_frm_ui)
        console.log(device_unique_id_frm_ui)
        console.log(qr_data_frm_ui)
        console.log(device_name_frm_ui)


        Connection.query('SELECT * FROM login_app WHERE vendor_code = ?', [vendor_code_frm_ui] , (err, rows) =>{
            Connection.release()

            if(!err){
                //res.send(`Record from scanner db login table added `)
                console.log(rows)

                if(rows.length > 0)
                {

                Object.keys(rows).forEach(function(key){

                    // data from db
                    let vendor_data = rows[key];
                    row_id = vendor_data.id
                    row_username = vendor_data.username
                    row_password = vendor_data.password
                    vendor_code = vendor_data.vendor_code
                    no_of_devices = vendor_data.no_devices
                    row_status = vendor_data.status
                    


                    console.log('\n')

                    session=req.session;
                    session.login_table_id=row_id;
                    session.userid=row_username;
                    session.user_password=row_password;
                    session.vendor_code_value=vendor_code;
                    session.no_of_devices_value=no_of_devices;
                    session.status_value=row_status;
                    

                    
                    

                    console.log('user name from session is')

                    console.log(session.userid)
                    console.log(session.user_password)
                    console.log(session.vendor_code_value)
                    console.log(session.no_of_devices_value)
                    console.log(session.status_value)
                    
                    console.log('\n')

                    // console.log('output of above using keys')
                    // console.log(login_data_rows);
                });


                if(no_of_devices > '0')
                {
                    console.log('you are eligible to register');


                    Connection.query('SELECT * FROM link_device_app WHERE vendor_code = ? AND device_unique_id = ?', [vendor_code_frm_ui, device_unique_id_frm_ui] , (err, rows1) =>{
                        // Connection.release()
            
                        if(!err){
                            
                            console.log(rows1)
                            // if device exists then again logout or register
                            if(rows1.length > 0)
                            {
                                console.log('device exists logging out')
                            }
                            else{
                                console.log('registration in progress')

                                // registering a device after all the checks are done

                                Connection.query('SELECT * FROM link_device_app WHERE vendor_code = ? AND qr_link_device_data = ?', [vendor_code_frm_ui, qr_data_frm_ui] , (err, rows2) =>{
                                    // Connection.release()
                        
                                    if(!err){
                                        //res.send(`Record from scanner db login table updated id: ${[username]} `)
                                        console.log(rows2)

                                        Object.keys(rows2).forEach(function(key){

                                            // data from db
                                            let vendor_link_data = rows2[key];
                                            link_table_row_id = vendor_link_data.id
                                            link_table_vendor_code = vendor_link_data.vendor_code
                                            link_table_qr_data = vendor_link_data.qr_link_device_data
                                            link_table_device_status = vendor_link_data.device_status
                                            
                                            
                        
                        
                                            console.log('\n')
                        
                                            session=req.session;
                                            session.link_table_row_id=link_table_row_id;
                                            session.link_table_vendor_code=link_table_vendor_code;
                                            session.link_table_qr_data=link_table_qr_data;
                                            session.link_table_device_status=link_table_device_status;
                                           
                                            
                        
                                            
                                            
                        
                                        });

                                        device_status1 = session.link_table_device_status
                                        qr_code_db =  session.link_table_qr_data
                                        //if device status is 3 then register else do not
                                        if(device_status1 == '3')
                                        {
                                            //checking qr data is matching from what we got from ui
                                            if(qr_code_db == qr_data_frm_ui)
                                            {
                                                // inserting device name and device unique id in the table and setting status to 1
                                                //decrementing device no to -1 then the count

                                                update_id = session.link_table_row_id

                                                // setting status to 1 as active
                                                update_status_of_device = '1';

                                                Connection.query('UPDATE link_device_app SET device_name = ?, device_unique_id = ?, device_status = ? WHERE id = ?', [device_name_frm_ui, device_unique_id_frm_ui, update_status_of_device, update_id] , (err, rows3) =>{
                                                    // Connection.release()
                                        
                                                    if(!err){
                                                        // res.send(`Record from scanner db login table updated id: ${[username]} `)
                                                        console.log('device registered and updated the record in link table')
                                                        console.log(rows3)
                                        
                                                    } else {
                                                        console.log(err)
                                                    }
                                                })

                                                no_of_device_db = session.no_of_devices_value
                                                update_id = session.login_table_id
                                                negative_one = '1'
                                                new_no_of_device_db = parseInt(no_of_device_db) - parseInt(negative_one)
                                                Connection.query('UPDATE login_app SET no_devices = ? WHERE id = ?', [new_no_of_device_db, update_id] , (err, rows3) =>{
                                                    // Connection.release()
                                        
                                                    if(!err){
                                                        // res.send(`Record from scanner db login table updated id: ${[username]} `)
                                                        console.log('login table updated and total no of devices decremented')
                                                        console.log(rows3)
                                        
                                                    } else {
                                                        console.log(err)
                                                    }
                                                })


                                                // ***************************************************


                                            }
                                            else{

                                                console.log('qr data did not match with ui scan again')

                                            }

                                        }
                                        else{
                                            
                                            console.log('unmatched  db data logging out back to login page')

                                        }




                        
                                    } else {
                                        console.log(err)
                                    }
                                })

                                // registering a device after all the checks are done


                            }

            
                        } else {
                            console.log(err)
                        }
                    })

                    

                }
                else{
                    console.log('you cannot register new device');
                }

                // check for vendor in vendor link table

                // Connection.query('SELECT * FROM link_device_app WHERE vendor_code = ? AND device_unique_id = ?', [vendor_code_frm_ui, device_unique_id_frm_ui] , (err, rows1) =>{
                //     Connection.release()
        
                //     if(!err){
                //         //res.send(`Record from scanner db login table added `)
                //         console.log(rows)
        
                //         if(rows1.length > 0)
                //         {
        
                //         Object.keys(rows1).forEach(function(key){
        
                //             // data from db
                //             let vdendor_link_data = rows1[key];
                //             row_id = vdendor_link_data.id
                //             row_username = vdendor_link_data.username
                //             row_password = vdendor_link_data.password
                //             vendor_code = vdendor_link_data.vendor_code
                //             no_of_devices = vdendor_link_data.no_devices
                //             row_status = vdendor_link_data.status
                            
        
        
                //             console.log('\n')
        
                //             session=req.session;
                //             session.userid=row_username;
                //             session.user_password=row_password;
                //             session.vendor_code_value=vendor_code;
                //             session.no_of_devices_value=no_of_devices;
                //             session.status_value=row_status;
                            
        
                            
                            
        
                //             console.log('user name from session is')
        
                //             console.log(session.userid)
                //             console.log(session.user_password)
                //             console.log(session.vendor_code_value)
                //             console.log(session.no_of_devices_value)
                //             console.log(session.status_value)
                            
                //             console.log('\n')
        
                //             // console.log('output of above using keys')
                //             // console.log(login_data_rows);
                //         });
        
                //         // check for vendor in vendor link table
        
                        
        
        
        
        
                        
        
        
                //         // check for vendor in vendor link table
                        
                //         }
                //         else{
                //             console.log('vendor does not exist')
                //         }
        
                //     } else {
                //         console.log(err)
                //     }
                // })




                


                // check for vendor in vendor link table
                
                }
                else{
                    console.log('vendor does not exist')
                }

            } else {
                console.log(err)
            }
        })
    })
})


//to insert data from record
app.post('/decode_data', (req, res) => {
    pool.getConnection((err, Connection) => {
        if(err) throw err
        console.log(`connected as id ${Connection.threadId}`)

        const {qr_check_data} = req.body
        console.log(qr_check_data)
       
        // Connection.query('INSERT INTO login_app SET ?', params , (err, rows) =>{
        //     Connection.release()

        //     if(!err){
        //         res.send(`Record from scanner db login table added `)
        //         console.log(rows)

        //     } else {
        //         console.log(err)
        //     }
        // })

        // decode data from nzcp.js

        const {verifyPassURI} = require('@vaxxnz/nzcp')
// https://nzcp.covid19.health.nz/#valid-worked-example
//const uri = "NZCP:/1/2KCEVIQEIVVWK6JNGEASNICZAEP2KALYDZSGSZB2O5SWEOTOPJRXALTDN53GSZBRHEXGQZLBNR2GQLTOPICRU2XI5UFQIGTMZIQIWYTWMOSGQQDDN5XHIZLYOSBHQJTIOR2HA4Z2F4XXO53XFZ3TGLTPOJTS6MRQGE4C6Y3SMVSGK3TUNFQWY4ZPOYYXQKTIOR2HA4Z2F4XW46TDOAXGG33WNFSDCOJONBSWC3DUNAXG46RPMNXW45DFPB2HGL3WGFTXMZLSONUW63TFGEXDALRQMR2HS4DFQJ2FMZLSNFTGSYLCNRSUG4TFMRSW45DJMFWG6UDVMJWGSY2DN53GSZCQMFZXG4LDOJSWIZLOORUWC3CTOVRGUZLDOSRWSZ3JOZSW4TTBNVSWISTBMNVWUZTBNVUWY6KOMFWWKZ2TOBQXE4TPO5RWI33CNIYTSNRQFUYDILJRGYDVA27NR3GFF4CCGWF66QGMJSJIF3KYID3KTKCBUOIKIC6VZ3SEGTGM3N2JTWKGDBAPLSG76Q3MXIDJRMNLETOKAUTSBOPVQEQAX25MF77RV6QVTTSCV2ZY2VMN7FATRGO3JATR";

const uri = qr_check_data;

async function main() {
  // verify pass with production issuer


  // verify pass with staging issuer
  const validPassResult = await verifyPassURI(uri, { trustedIssuer: "did:web:nzcp.covid19.health.nz", success: "true" });
  console.log('validPassResult', validPassResult);



  var bleh = validPassResult;
  console.log(bleh.success);

  if(bleh.success == true)
  {
    console.log(bleh.success);
    console.log(bleh.expires);
    console.log(bleh.validFrom);
    console.log(bleh.credentialSubject.givenName);
    console.log(bleh.credentialSubject.familyName);
    console.log(bleh.credentialSubject.dob);


  }
  else{
    console.log(bleh.violates.message);
    console.log(bleh.violates.description);
    console.log(bleh.expires);
    console.log(bleh.validFrom);
    console.log(bleh.credentialSubject.givenName);
    console.log(bleh.credentialSubject.familyName);
    console.log(bleh.credentialSubject.dob);
  }
 


}

main()


        // decode data from nzcp.js






    })
})










//listen to environment port or 5000
app.listen(Port, () => console.log(`listen on port ${Port}`))