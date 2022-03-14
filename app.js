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




// ***********************************************************************************************************************************

// check for user present in db
//to insert data from record
app.post('/check_user', (req, res) => {
    pool.getConnection((err, Connection) => {
        if(err) throw err
        console.log(`connected as id ${Connection.threadId}`)


        //data got from UI
        const {username, password} = req.body
        console.log(username)
        console.log(password)

      
        //creating variables to store data of output got from database
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
                    console.log('**************** data from database start *****************')

                    console.log(login_data_rows);

                    console.log('\n')
                    console.log('***********************************************************')

                    
                    console.log('\n')
                    console.log('**************** data from UI start *****************')

                    console.log('user values from user')
                    console.log(username)
                    console.log(password)
                    console.log('\n')
                    console.log('***********************************************************')


                    console.log('\n')
                    console.log('******* data from database using keys start *************')
                    console.log(row_username)
                    console.log(row_password)
                    console.log(row_status)
                    console.log(no_of_devices)
                    console.log(vendor_code)
                    console.log('\n')
                    console.log('***********************************************************')

                    console.log('\n')
                    console.log('**************** data in session variable *****************')
                    session=req.session;
                    session.userid=username;

                    session.status_value=row_status;
                    session.user_password=password;

                    session.no_of_devices_value=no_of_devices;
                    session.vendor_code_value=vendor_code;

                    console.log('\n')
                    console.log('**************** user name from session is *****************')
                    console.log(session.userid)
                    console.log(session.user_password)
                    console.log(session.status_value)
                    console.log(session.no_of_devices_value)
                    console.log(session.vendor_code_value)
                    console.log('\n')

                    // console.log('output of above using keys')
                    // console.log(login_data_rows);
                });


                // checking if user is disabled by admin or not by checking status is 1
                if(session.status_value == '1'){
                    const userexists = '1';
                    session.userexists = userexists;
                    let status = '1';

                    // console.log(session.userexists)

                    session.status_value_db = status;
                    console.log('user is active')
                    console.log(session.userexists)
                    

                }
                else{

                    console.log('**************** send response to client start *****************')
                    console.log('user is disabled by admin')

                    var data = "1";
                // res.send(computerSciencePortal);

                    console.log(data);  
                    return res.send(JSON.stringify(data));  

                    console.log('**************** send response to client end *****************')

                    session.destroy();
                }

   
                console.log("\n");
                
                // if username dosenot match then its an invalid email so logout back to login screen
            }
            else{

                console.log('**************** send response to client start*****************')
                console.log('username invalid. please try again')
                var data = "2";
                // res.send(computerSciencePortal);

                console.log(data);  
                return res.send(JSON.stringify(data));  

                console.log('**************** send response to client end*****************')
                
                // res.end(JSON.stringify({"status": 200, "error": null, "response": computerSciencePortal}));
  

                req.session.destroy();
                // res.send('username invalid. please try again') 
            }

            console.log('\n')
            console.log('***********************************************************')

            console.log('got user as active and user exists')
            console.log(session.userexists)

            console.log('\n')
            console.log('***********************************************************')


            if((session.userexists == '1'))
        {
              Connection.query('SELECT * FROM login_app WHERE username = ? AND password = ?', [username, password], (err, rows) =>{
                    if(err){
                        console.log(err)
                    }

                    // Connection.release()

                    if(rows.length > 0)
                    {
                        // res.send(rows)
                        console.log('username and password matched')

                        //if username and password matched check for no of devices and uniqueness
                        //if numbder of devices is 0
                        if(session.no_of_devices_value == '0')
                        {

                            console.log('\n')
                            console.log('************ devices = 0 *************')

                            console.log(session.vendor_code_value)
                            const vendor_code_now = session.vendor_code_value

                            console.log('do not allow login as device list is full')
                            console.log('device list is full and to register this device delete devices from registered devices section')

                            console.log('**************** send response to client start*****************')
                            var data = "3";
                            // res.send(computerSciencePortal);

                            console.log(data);  
                            res.send(JSON.stringify(data));  

                            console.log('**************** send response to client end*****************')
                           

                        }
                        //if number of devices is greater then 0

                        // else if(session.no_of_devices_value > '0'){

                        else{

                            console.log('\n')
                            console.log('************** devices > 0 ****************')
                            console.log(session.vendor_code_value)
                            console.log(session.no_of_devices_value)
                    
                            const vendor_code_value = session.vendor_code_value
                            const no_of_devices_value = session.no_of_devices_value
                           
                            console.log('allow the user to register this device')

                            console.log('**************** send response to client start*****************')
                            var dataverify = "4";
                            // res.send(computerSciencePortal);

                            console.log(dataverify);  

                           const device_value = no_of_devices_value.toString()


                            const data = {
                                verify: dataverify,
                                vendorCode: vendor_code_value,
                                deviceValue: device_value

                            }



                            return res.send(JSON.stringify(data));  

                            console.log('**************** send response to client end*****************')

                            


                        }


                        //if username and password matched check for no of devices and uniqueness

                        session.destroy();
                        // res.send('username and password matched') 
                    }
                    else{
                        console.log('password invalid. please try again') 

                        console.log('**************** send response to client start*****************')
                            var data = "5";
                            // res.send(computerSciencePortal);

                            console.log(data);  
                            return res.send(JSON.stringify(data));  

                            console.log('**************** send response to client end*****************')

                        session.destroy();
                    }
                });
        }


        });

        // console.log('user exixts session value')
        // console.log(session.userexists)

        
        
    })
})

// checking for user present in db and redirecting users to register device or not allowing them to login
// ***********************************************************************************************************************************



// ***********************************************************************************************************************************
// Register new device if device number is not equal to zero
//to link a device
app.post('/link_device', (req, res) => {
    pool.getConnection((err, Connection) => {
        if(err) throw err
        console.log(`connected as id ${Connection.threadId}`)

        const {vendor_code_frm_ui, no_of_devices_frm_ui, qr_data_frm_ui, device_name_frm_ui} = req.body

        console.log(vendor_code_frm_ui)
        console.log(no_of_devices_frm_ui)
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
                    

                    
                    
                    console.log('\n')
                    console.log('***********************************************************')
                    console.log('user name from session is')

                    console.log(session.userid)
                    console.log(session.user_password)
                    console.log(session.vendor_code_value)
                    console.log(session.no_of_devices_value)
                    console.log(session.status_value)
                    
                    console.log('\n')
                    console.log('***********************************************************')

                    // console.log('output of above using keys')
                    // console.log(login_data_rows);
                });

                if(session.status_value == '1')
                {

                

                if(session.no_of_devices_value > '0')
                {
                    console.log('\n')
                    console.log('***********************************************************')
                    console.log('you are eligible to register');


                   

                    //value of ui is sent when you are eligible to register and the value matches the backend 
                    // just to be shure that while registering the device the users dont keep the qr open and register after a long time
                    // while registering other devices
                    

                                console.log('\n')
                                console.log('***********************************************************')
                                console.log('registration in progress')

                                // registering a device after all the checks are done

                                Connection.query('SELECT * FROM link_device_app WHERE vendor_code = ? AND qr_link_device_data = ?', [vendor_code_frm_ui, qr_data_frm_ui] , (err, rows2) =>{
                                    // Connection.release()
                        
                                    if(!err){
                                        //res.send(`Record from scanner db login table updated id: ${[username]} `)
                                        console.log('\n')
                                        console.log('***********Data from db********************')
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


                                            console.log('\n')
                                            console.log('***********************************************************')
                                            console.log(link_table_row_id)
                                            console.log(link_table_vendor_code)
                                            console.log(link_table_qr_data)
                                            console.log(link_table_device_status)
                                            
                        
                                            
                                            
                        
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

                                                Connection.query('UPDATE link_device_app SET device_name = ?, device_status = ? WHERE id = ?', [device_name_frm_ui, update_status_of_device, update_id] , (err, rows3) =>{
                                                    // Connection.release()
                                        
                                                    if(!err){
                                                        // res.send(`Record from scanner db login table updated id: ${[username]} `)
                                                        console.log('\n')
                                                        console.log('***********************************************************')
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
                                                        console.log('\n')
                                                        console.log('***********************************************************')
                                                        console.log('login table updated and total no of devices decremented')
                                                        console.log('\n')
                                                        console.log('updated login table data is as below')
                                                        console.log(rows3)

                                                        console.log('**************** send response to client start*****************')
                                                        var data = "1";
                                                        // res.send(computerSciencePortal);

                                                        console.log("move to home screen")
                                                        console.log(data);  
                                                        return res.send(JSON.stringify(data));  

                                                        console.log('**************** send response to client end*****************')

                                        
                                                    } else {
                                                        console.log(err)
                                                    }
                                                })


                                                // ***************************************************


                                            }
                                            else{

                                                console.log('\n')
                                            console.log('***********************************************************')
                                                console.log('qr data did not match with ui scan again')


                                                console.log('**************** send response to client start*****************')
                                                var data = "2";
                                                // res.send(computerSciencePortal);

                                                console.log("qr code data did not match")
                                                console.log(data);  
                                                return res.send(JSON.stringify(data));  

                                                console.log('**************** send response to client end*****************')

                                            }

                                        }
                                        else{
                                            
                                            console.log('\n')
                                            console.log('***********************************************************')
                                            console.log('unmatched  db data logging out back to login page')
                                            console.log('Either your Qr Code is wrong or the Qr code that you are trying to register is already active')
                                            console.log('delete a device from vendor panel and try again')

                                            console.log('**************** send response to client start*****************')
                                            var data = "3";
                                            // res.send(computerSciencePortal);

                                            console.log("QR Data did not match /phone is already registered")
                                            console.log(data);  
                                            return res.send(JSON.stringify(data));  

                                            console.log('**************** send response to client end*****************')


                                        }




                        
                                    } else {
                                        console.log(err)
                                    }
                                })

                                // registering a device after all the checks are done
  

                }
                else{
                    console.log('\n')
                    console.log('***********************************************************')
                    console.log('you cannot register new device');
                    console.log('going back to login page');

                    console.log('**************** send response to client start*****************')
                    var data = "4";
                            // res.send(computerSciencePortal);

                    console.log("device list full")
                    console.log(data);  
                    return res.send(JSON.stringify(data));  

                    console.log('**************** send response to client end*****************')
                }


            }
            else{
                console.log('\n')
                console.log('***********************************************************')
                console.log('vendor is disabled by admin');

                console.log('**************** send response to client start*****************')
                var data = "5";
                            // res.send(computerSciencePortal);

                console.log("disabled by admin")
                console.log(data);  
                return res.send(JSON.stringify(data));  

                console.log('**************** send response to client end*****************')
            }


                // check for vendor in vendor link table
                
                }
                else{
                    console.log('vendor does not exist')

                    console.log('**************** send response to client start*****************')
                     var data = "6";
                            // res.send(computerSciencePortal);

                    console.log("vendor does not exist")
                    console.log(data);  
                    return res.send(JSON.stringify(data));  

                    console.log('**************** send response to client end*****************')
                }

            } else {
                console.log(err)
            }
        })
    })
})


// Register new device if device number is not equal to zero
// ***********************************************************************************************************************************



// decoding data
//to insert data from record
app.post('/decode_data', (req, res) => {
    pool.getConnection((err, Connection) => {
        if(err) throw err
        console.log(`connected as id ${Connection.threadId}`)

        const {qr_check_data, vendor_code} = req.body
        console.log('********** data from ui **************')
        console.log(qr_check_data)
        console.log(vendor_code)


       
       
        //    checking for payments and disable staus

                Connection.query('SELECT * FROM login_app WHERE vendor_code = ?', [vendor_code] , (err, rows) =>{
                    Connection.release()

                    if(!err){
                        // res.send(`Record from scanner db login table added `)
                        console.log(rows)


                        Object.keys(rows).forEach(function(key){

                            // data from db
                            let login_data_rows = rows[key];
                            vendor_disable_status = login_data_rows.status
                            payment_status = login_data_rows.payment_status
                            vendor_code_frm_db = login_data_rows.vendor_code
        
        
                            console.log('\n')
        
                            session=req.session;
                            session.vendor_disable_status=vendor_disable_status;
        
                            session.payment_status=payment_status;
                            session.vendor_code_frm_db=vendor_code_frm_db;
        
                            console.log('vendor details from db is')
        
                            console.log(session.vendor_disable_status)
                            console.log(session.payment_status)
                            console.log(session.vendor_code_frm_db)
                            console.log('\n')


                            if(session.vendor_disable_status == '1'){


                                if(session.payment_status == '1'){



                                    // decripting data
                                    Connection.query('select * from login_app WHERE vendor_code = ? AND payment_status = 1', [vendor_code] , (err, rows) =>{
                                        // Connection.release()
                            
                                        if(!err){
                                                    // decode data from nzcp.js
                            
                                    if(rows.length > 0)
                                    {
                                        // if payment status and status is active allow scanning
                            
                            
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

                                            console.log('**************** send response to client start*****************')
                                            var data = "1";
                                            // res.send(computerSciencePortal);

                                            console.log("success")
                                            console.log(data);  
                                            return res.send(JSON.stringify(data));  

                                            console.log('**************** send response to client end*****************')
                                        
                                        
                                            // update no of count of customers went inside on success
                                        
                                            // Connection.query('INSERT INTO login_app SET ?', params , (err, rows) =>{
                                            //     Connection.release()
                                        
                                            //     if(!err){
                                            //         res.send(`Record from scanner db login table added `)
                                            //         console.log(rows)
                                        
                                            //     } else {
                                            //         console.log(err)
                                            //     }
                                            // })
                                        
                                        
                                          }
                                          else{
                                            console.log(bleh.violates.message);
                                            console.log(bleh.violates.description);
                                            console.log(bleh.expires);
                                            console.log(bleh.validFrom);
                                            // console.log(bleh.credentialSubject.givenName);
                                            // console.log(bleh.credentialSubject.familyName);
                                            // console.log(bleh.credentialSubject.dob);

                                            console.log('**************** send response to client start failure*****************')
                                            var data = "2";
                                            // res.send(computerSciencePortal);

                                            console.log("failure")
                                            console.log(data);  
                                            return res.send(JSON.stringify(data));  

                                            console.log('**************** send response to client end*****************')

                                          }
                                         
                                        
                                        
                                        }
                                        
                                        main()
                                        
                                        
                                                // decode data from nzcp.js
                            
                            
                            
                            
                            
                                    }  
                                    else{
                                        // if payments or staus is inactive disable from scanning
                            
                                        console.log('********** either your payments is inactive **************')
                                        console.log('********** OR **************')
                                        console.log('********** You are disabled by admin **************')

                                        console.log('**************** send response to client start*****************')
                                        var data = "3";
                                            // res.send(computerSciencePortal);

                                        console.log("payments not done / disabled by admin")
                                        console.log(data);  
                                        return res.send(JSON.stringify(data));  

                                        console.log('**************** send response to client end*****************')
                                    }              
                            
                                   
                            
                                        } else {
                                            console.log('error while checking for vendor')
                                            console.log(err)
                                        }
                                    })
                            
                                    // decrypting data

                                    // var data = "4";
                                    //         // res.send(computerSciencePortal);

                                    // console.log("payments inactive")
                                    // console.log(data);  
                                    // return res.send(JSON.stringify(data));


                                    // goes by default on success or failure

                                }
                                else{
                                    console.log('payments status inactive')
                                    console.log('**************** send response to client start*****************')
                                    var data = "4";
                                            // res.send(computerSciencePortal);

                                    console.log("payments inactive")
                                    console.log(data);  
                                    return res.send(JSON.stringify(data));  

                                    console.log('**************** send response to client end*****************')
                                }

                            }
                            else{
                                console.log('vendor disabled by admin')

                                console.log('**************** send response to client start*****************')
                                var data = "5";
                                            // res.send(computerSciencePortal);

                                console.log("disabled by admin")
                                console.log(data);  
                                return res.send(JSON.stringify(data));  

                                console.log('**************** send response to client end*****************')
                            }
        
                            // console.log('output of above using keys')
                            // console.log(login_data_rows);
                        });




                    } else {
                        console.log(err)
                    }
                })
           
       








    })
})


// decoding data
// ***********************************************************************************************************************************




// logout from app
//to insert data from record
app.post('/logout', (req, res) => {
    pool.getConnection((err, Connection) => {
        if(err) throw err
        console.log(`connected as id ${Connection.threadId}`)

        const {qr_data_logout, vendor_code_logout} = req.body
        console.log('********** data from ui **************')
        console.log(qr_data_logout)
        console.log(vendor_code_logout)



        // Connection.query('SELECT * FROM login_app WHERE vendor_code = ?', [ vendor_code_logout] , (err, rows) =>{
            // Connection.release()

            // if(!err){
            //     // res.send(`Record from scanner db login table added `)
            //     console.log('********** vendor login details from login table **************')
            //     console.log(rows);

                // if(rows.length > 0)
                // {


                // Object.keys(rows).forEach(function(key){

                //     // data from db
                //     let login_data_rows = rows[key];
                //     no_of_devices_frm_login1 = login_data_rows.no_devices
                //     vendor_code_frm_login1 = login_data_rows.vendor_code

                //     // console.log(login_data_rows);

                //     console.log('********** data from user **************')
                 

                //     console.log('\n')

                //     session=req.session;
                //     session.no_of_devices_frm_login=no_of_devices_frm_login1;

                //     session.vendor_code_frm_login=vendor_code_frm_login1;

                //     console.log('********** user name from session is **************')
                //     console.log('\n')

                //     console.log(session.no_of_devices_frm_login)
                //     console.log(session.vendor_code_frm_login)
                    
                //     console.log('\n')

                //     // console.log('output of above using keys')
                //     // console.log(login_data_rows);
                // })

                // console.log(session.vendor_code_frm_login)
                // if(!!session.vendor_code_frm_login){

                    // if vendor exists then delete device data

                    Connection.query('DELETE FROM link_device_app WHERE vendor_code = ? AND qr_link_device_data = ?', [qr_data_logout, vendor_code_logout] , (err, rows) =>{
                        // Connection.release()
            
                        if(!err){
                            // res.send(`Record from scanner db login table added `)
                            console.log('********** vendor device details deleted from link table **************')
                            console.log('\n')
            
            
            
                            // increment device list in login table
                            const no_devices_before_increment = '0'
            
                            const increment_by_one = '1'
            
                            const new_device_list = parseInt(no_devices_before_increment) + parseInt(increment_by_one)
            
            
                            Connection.query('UPDATE login_app SET no_devices = ? WHERE vendor_code = ?', [new_device_list, vendor_code_logout] , (err, rows) =>{
                                // Connection.release()
                               
                    
                                if(!err){
                                    // res.send(`Record from scanner db login table added `)
                                    console.log('********** vendor device list updated **************')
                                    console.log('\n')
                                    console.log(rows)
                    
                    
                                } else {
                                    console.log(err)
                                }
                            })
            
                            // increment device list in login tyable
            
            
            
                        } else {
                            console.log(err)
                        }
                    })


                // }
                // else{
                //     console.log('no vendors found')
                // }

                    // if vendor exists then delete device data
                // }
                // else{
                //     console.log('vendor does not exist')
                // }
                

            // } else {
            //     console.log(err)
            // }
        })





        
    })
// })

// logout from app





// logging out
app.post('/logout1', (req, res) => {
    pool.getConnection((err, Connection) => {
        if(err) throw err
        console.log(`connected as id ${Connection.threadId}`)

        const {qr_data_logout, vendor_code_logout} = req.body
        console.log('********** data from ui **************')
        console.log(qr_data_logout)
        console.log(vendor_code_logout)

        Connection.query('SELECT * FROM login_app WHERE vendor_code = ?', [ vendor_code_logout] , (err, rows) =>{
            // Connection.release()

            if(!err){
                // res.send(`Record from scanner db login table added `)
                console.log(rows)

                 Object.keys(rows).forEach(function(key){

                    // data from db
                    let login_data_rows = rows[key];
                    no_of_devices_frm_login1 = login_data_rows.no_devices
                    vendor_code_frm_login1 = login_data_rows.vendor_code

                    // console.log(login_data_rows);

                 

                    console.log('\n')

                    session=req.session;
                    session.no_of_devices_frm_login=no_of_devices_frm_login1;

                    session.vendor_code_frm_login=vendor_code_frm_login1;

                    console.log('********** user name from session is **************')
                    console.log('\n')

                    console.log(session.no_of_devices_frm_login)
                    console.log(session.vendor_code_frm_login)
                    
                    console.log('\n')

                    // console.log('output of above using keys')
                    // console.log(login_data_rows);
                });

                if(session.vendor_code_frm_login)
                {
                    console.log('has value')
                    // deleting values from databse

                    Connection.query('DELETE FROM link_device_app WHERE vendor_code = ? AND qr_link_device_data = ?', [vendor_code_logout, qr_data_logout] , (err, rows) =>{
                        // Connection.release()
            
                        if(!err){
                            // res.send(`Record from scanner db login table added `)
                            console.log('********** vendor device details deleted from link table **************')
                            console.log('\n')
            
            
            
                            // increment device list in login table
                            const no_devices_before_increment = session.no_of_devices_frm_login
            
                            const increment_by_one = '1'
            
                            const new_device_list = parseInt(no_devices_before_increment) + parseInt(increment_by_one)
            
            
                            Connection.query('UPDATE login_app SET no_devices = ? WHERE vendor_code = ?', [new_device_list, vendor_code_logout] , (err, rows) =>{
                                // Connection.release()
                               
                    
                                if(!err){
                                    // res.send(`Record from scanner db login table added `)
                                    console.log('********** vendor device list updated **************')
                                    console.log('\n')
                                    console.log(rows)

                                    console.log('**************** send response to client start*****************')
                                var data = "1";
                                            // res.send(computerSciencePortal);

                                console.log("logging out")
                                console.log(data);  
                                return res.send(JSON.stringify(data));  

                                console.log('**************** send response to client end*****************')
                    
                    
                                } else {
                                    console.log(err)
                                }
                            })
            
                            // increment device list in login tyable
            
            
            
                        } else {
                            console.log(err)
                        }
                    })

                    // deleting values from database
                }
                else{
                    console.log('null')
                }


            } else {
                console.log(err)
            }
        })
    })
})


// logging out





//listen to environment port or 5000
app.listen(Port, () => console.log(`listen on port ${Port}`))