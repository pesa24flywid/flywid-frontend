import React, { useEffect, useState } from 'react'
import DashboardWrapper from '../../../../hocs/DashboardLayout'
import $ from 'jquery'
import {
  Box,
  Input,
  InputGroup,
  InputLeftAddon,
  Button,
  FormControl,
  FormLabel,
  Select,
  Stack,
  HStack,
  useToast,
  Radio,
  RadioGroup,
  Checkbox
} from '@chakra-ui/react'
import { useFormik } from 'formik'
import BackendAxios, { ClientAxios } from '../../../../lib/axios'
import { Grid } from 'gridjs-react'
import "gridjs/dist/theme/mermaid.css";
import PermissionMiddleware from '../../../../lib/utils/checkPermission'

const Aeps = () => {

  useEffect(() => {

    ClientAxios.post('/api/user/fetch', {
      user_id: localStorage.getItem('userId')
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((res) => {
      if (res.data[0].allowed_pages.includes('aepsBasic') == false) {
        window.location.assign('/dashboard/not-allowed')
      }
    }).catch((err) => {
      console.log(err)
    })
  }, [])

  let MethodInfo
  const [isBtnLoading, setIsBtnLoading] = useState(false)
  const [biometricDevice, setBiometricDevice] = useState("")
  const Toast = useToast()
  const formik = useFormik({
    initialValues: {
      aadhaarNo: "",
      customerId: "",
      bankCode: "",
      bankAccountNo: "",
      ifsc: "",
      serviceCode: "2",         // Services Code as per service provider
      pid: "",
      amount: "",
      serviceId: "20"           // Services ID as per Pesa24 Portal
    },
    onSubmit: async (values) => {
      setIsBtnLoading(true)
      await BackendAxios.post(`/api/eko/aeps/money-transfer/${values.serviceId}`, values).then((res) => {
        Toast({
          description: res.data.message,
          position: 'top-right'
        })
        console.log(res.data)
      }).catch((err) => {
        Toast({
          title: 'Transaction Failed',
          description: err.message,
          position: 'top-right',
        })
      })
      setIsBtnLoading(false)
    }
  })

  const transactions = [
    ["25-01-2023 18:54", "Member29", "BFAJFDHA", "Cash Witdrawal", "successful", "20000", "2000", "18000", "No remarks"],
  ]

  function getMantra() {
    var GetCustomDomName = "127.0.0.1";
    var SuccessFlag = 0;
    var primaryUrl = "http://" + GetCustomDomName + ":";
    var url = "";
    var SuccessFlag = 0;

    var verb = "RDSERVICE";
    var err = "";

    var MethodCapture = "/rd/capture"
    var MethodCapture = "/rd/info"

    var res;
    $.support.cors = true;
    var httpStaus = false;
    var jsonstr = "";
    var data = new Object();
    var obj = new Object();

    $.ajax({
      type: "RDSERVICE",
      async: false,
      crossDomain: true,
      url: primaryUrl + 11100,
      contentType: "text/xml; charset=utf-8",
      processData: false,
      cache: false,
      success: function (data) {
        var $doc = $.parseXML(data);
        var CmbData1 = $($doc).find('RDService').attr('status');
        var CmbData2 = $($doc).find('RDService').attr('info');
        if (CmbData1 == "READY") {
          SuccessFlag = 1;
          if (RegExp('\\b' + 'Mantra' + '\\b').test(CmbData2) == true) {
            if ($($doc).find('Interface').eq(0).attr('path') == "/rd/capture") {
              MethodCapture = $($doc).find('Interface').eq(0).attr('path');
            }
            if ($($doc).find('Interface').eq(1).attr('path') == "/rd/capture") {
              MethodCapture = $($doc).find('Interface').eq(1).attr('path');
            }
            if ($($doc).find('Interface').eq(0).attr('path') == "/rd/info") {
              MethodInfo = $($doc).find('Interface').eq(0).attr('path');
            }
            if ($($doc).find('Interface').eq(1).attr('path') == "/rd/info") {
              MethodInfo = $($doc).find('Interface').eq(1).attr('path');
            }
          }
        }
        else {
          SuccessFlag = 0;
        }
      },
    });

    if (SuccessFlag == 1) {
      //alert("RDSERVICE Discover Successfully");
      var XML = '<' + '?' + 'xml version="1.0"?> <PidOptions ver="1.0"> <Opts fCount="1" fType="0" iCount="0" pCount="0" pgCount="2" format="0"   pidVer="2.0" timeout="10000" pTimeout="20000" posh="UNKNOWN" env="P" /> <CustOpts><Param name="mantrakey" value="" /></CustOpts> </PidOptions>';
      var finalUrl = "http://" + GetCustomDomName + ":" + 11100;
      var verb = "CAPTURE";
      var err = "";
      var res;
      $.support.cors = true;
      var httpStaus = false;
      var jsonstr = "";

      $.ajax({
        type: "CAPTURE",
        async: false,
        crossDomain: true,
        url: finalUrl + MethodCapture,
        data: XML,
        contentType: "text/xml; charset=utf-8",
        processData: false,
        success: async function (data) {
          var $doc = $.parseXML(data);
          var Message = $($doc).find('Resp').attr('errInfo');
          var errCode = $($doc).find('Resp').attr('errCode');
          var srno = $($doc).find('Param').attr('value');
          var Skey = ($doc.getElementsByTagName("Skey")[0].childNodes[0]).nodeValue;
          var PidData = ($doc.getElementsByTagName("Data")[0].childNodes[0]).nodeValue;
          var PidDatatype = $($doc).find('Data').attr('type');
          var hmac = ($doc.getElementsByTagName("Hmac")[0].childNodes[0]).nodeValue;
          var sessionKey = ($doc.getElementsByTagName("Skey")[0].childNodes[0]).nodeValue;

          var ci = $($doc).find('Skey').attr('ci');
          var mc = $($doc).find('DeviceInfo').attr('mc');
          var mi = $($doc).find('DeviceInfo').attr('mi');
          var dc = $($doc).find('DeviceInfo').attr('dc');
          var rdsVer = $($doc).find('DeviceInfo').attr('rdsVer');
          var rdsID = $($doc).find('DeviceInfo').attr('rdsId');
          var dpID = $($doc).find('DeviceInfo').attr('dpId');
          var qScore = $($doc).find('Resp').attr('qScore');
          var nmPoints = $($doc).find('Resp').attr('nmPoints');
          var pType = 0;
          var pCount = 0;
          var iType = 0;
          var iCount = 0;
          var fType = $($doc).find('Resp').attr('fType');
          var fCount = $($doc).find('Resp').attr('fCount');
          var errInfo = $($doc).find('Resp').attr('errInfo');
          var errCode = $($doc).find('Resp').attr('errCode');

          if (errCode == "0") {
            Toast({
              status: "success",
              title: "Fingerprint Captured",
              position: "top-right"
            })
            formik.setFieldValue("pid", data).then(() => {
              formik.handleSubmit()
            })
          }
          else {
            alert("Error : " + Message);
          }

        }
      });
    }
    else {
      Toast({
        status: "error",
        title: "Biometric Device Not Found",
        description: "Please connect your device and refresh this page.",
        position: "top-right"
      })
      setIsBtnLoading(false)
    }
  }

  function searchMantra() {

    var GetCustomDomName = "127.0.0.1";
    var primaryUrl = "http://" + GetCustomDomName + ":";
    var url = "";
    var MantraFound = 0;

    var verb = "RDSERVICE";
    var err = "";

    var MethodCapture = "/rd/capture"
    var MethodCapture = "/rd/info"

    var res;
    $.support.cors = true;
    var httpStaus = false;
    var jsonstr = "";
    var data = new Object();
    var obj = new Object();

    $.ajax({
      type: "RDSERVICE",
      async: false,
      crossDomain: true,
      url: primaryUrl + 11100,
      contentType: "text/xml; charset=utf-8",
      processData: false,
      cache: false,
      crossDomain: true,
      success: function (data) {
        var $doc = $.parseXML(data);
        var CmbData1 = $($doc).find('RDService').attr('status');
        var CmbData2 = $($doc).find('RDService').attr('info');
        if (CmbData1 == "READY") {
          MantraFound = 1;
          setBiometricDevice("mantra")
        }
        else {
          MantraFound = 0;
        }
      },
    })

    if (MantraFound != 1) {
      Toast({
        status: "error",
        title: "Biometric Device Not Found",
        description: "Please connect your device and refresh this page.",
        position: "top-right"
      })
    }
  }

  useEffect(() => {
    searchMantra()
  }, [])

  useEffect(() => {
    formik.values.serviceCode != "2" ? formik.setFieldValue("amount", "0") : null
    formik.values.serviceCode == "2" ? formik.setFieldValue("serviceId", "20") : null
  }, [formik.values.serviceCode])

  function handleSubmit() {
    if (formik.values.serviceCode == "2") {
      getMantra()
    }
    else {
      formik.handleSubmit
    }
  }

  return (
    <>
      <DashboardWrapper titleText={'AePS Transaction'}>
        <Box my={4} w={['full', 'md', 'full']} p={6} boxShadow={'md'} bg={'white'}>
          <FormControl w={'xs'} pb={8}>
            <FormLabel>Select Service</FormLabel>
            <Select name='serviceCode' value={formik.values.serviceCode} onChange={formik.handleChange}>
              <option value={2}>Cash Withdrawal</option>
              <option value={3}>Balance Inquiry</option>
              <option value={4}>Mini Statement</option>
            </Select>
          </FormControl>

          <FormControl pb={6}>
            <FormLabel>Choose Device</FormLabel>
            <RadioGroup name={'rdDevice'} value={biometricDevice} onChange={(value) => setBiometricDevice(value)}>
              <Stack direction={['column', 'row']} spacing={4}>
                <Radio value='mantra'>Mantra</Radio>
                <Radio value='morpho'>Morpho</Radio>
                <Radio value='secugen'>Secugen</Radio>
                <Radio value='startek'>Startek</Radio>
              </Stack>
            </RadioGroup>
          </FormControl>

          {/* Cash Withdrawal Form */}
          {
            formik.values.serviceCode == "2" ? <>
              <FormControl w={'full'} pb={6}>
                <FormLabel>Select Bank</FormLabel>
                <Select name='bankCode' value={formik.values.bankCode} onChange={formik.handleChange} w={'xs'}>
                  <option value="SBIN">State Bank of India</option>
                  <option value="pnb">Punjab National Bank</option>
                  <option value="cb">City Bank</option>
                  <option value="yb">Yes Bank</option>
                </Select>
                <HStack spacing={2} py={2}>

                  <Button
                    fontSize={'xs'}
                    value={"SBIN"}
                    onClick={(e) => formik.setFieldValue("bankCode", e.target.value)}
                  >State Bank of India</Button>

                  <Button
                    fontSize={'xs'}
                    value={"pnb"}
                    onClick={(e) => formik.setFieldValue("bankCode", e.target.value)}
                  >Punjab National Bank</Button>

                  <Button
                    fontSize={'xs'}
                    value={"yb"}
                    onClick={(e) => formik.setFieldValue("bankCode", e.target.value)}
                  >Yes Bank</Button>

                </HStack>
              </FormControl>
              <Stack direction={['column', 'row']} spacing={6} pb={6}>
                <FormControl w={'full'}>
                  <FormLabel>Aadhaar Number / VID</FormLabel>
                  <Input name='aadhaarNo' placeholder='Aadhaar Number or VID' value={formik.values.aadhaarNo} onChange={formik.handleChange} />
                  <HStack py={2}>
                    <Checkbox name={'isVID'}>It is a VID</Checkbox>
                  </HStack>
                </FormControl>
                <FormControl w={'full'}>
                  <FormLabel>Phone Number</FormLabel>
                  <InputGroup>
                    <InputLeftAddon children={'+91'} />
                    <Input name='customerId' placeholder='Customer Phone Number' value={formik.values.customerId} onChange={formik.handleChange} />
                  </InputGroup>
                </FormControl>
                <FormControl w={'full'}>
                  <FormLabel>Amount</FormLabel>
                  <InputGroup>
                    <InputLeftAddon children={"₹"} />
                    <Input name='amount' placeholder='Enter Amount' value={formik.values.amount} onChange={formik.handleChange} />
                  </InputGroup>
                  <HStack spacing={2} py={2}>

                    <Button
                      fontSize={'xs'}
                      value={1000}
                      onClick={(e) => formik.setFieldValue("amount", e.target.value)}
                    >1000</Button>

                    <Button
                      fontSize={'xs'}
                      value={2000}
                      onClick={(e) => formik.setFieldValue("amount", e.target.value)}
                    >2000</Button>

                    <Button
                      fontSize={'xs'}
                      value={5000}
                      onClick={(e) => formik.setFieldValue("amount", e.target.value)}
                    >5000</Button>

                  </HStack>
                </FormControl>
              </Stack>
            </> : null
          }

          {/* Balance Enquiry Form */}
          {
            formik.values.serviceCode == "3" ? <>
              <Stack direction={['column', 'row']} spacing={6} pb={6}>
                <FormControl w={'full'}>
                  <FormLabel>Aadhaar Number</FormLabel>
                  <Input name='aadhaarNo' placeholder='Customer Aadhaar Number' value={formik.values.aadhaarNo} onChange={formik.handleChange} />
                </FormControl>
                <FormControl w={'full'}>
                  <FormLabel>Phone Number</FormLabel>
                  <InputGroup>
                    <InputLeftAddon children={'+91'} />
                    <Input name='customerId' placeholder='Customer Phone Number' value={formik.values.customerId} onChange={formik.handleChange} />
                  </InputGroup>
                </FormControl>
                <FormControl w={'full'}>
                  <FormLabel>Select Bank</FormLabel>
                  <Select name='bankCode' value={formik.values.bankCode} onChange={formik.handleChange}>
                    <option value="SBIN">State Bank of India</option>
                    <option value="bob">Bank of Baroda</option>
                    <option value="hdfc">HDFC Bank</option>
                  </Select>
                </FormControl>
              </Stack>
            </> : null
          }

          {/* Mini Statement Form */}
          {
            formik.values.serviceCode == "4" ? <>
              <Stack direction={['column', 'row']} spacing={6} pb={6}>
                <FormControl w={'full'}>
                  <FormLabel>Aadhaar Number</FormLabel>
                  <Input name='aadhaarNo' placeholder='Customer Aadhaar Number' value={formik.values.aadhaarNo} onChange={formik.handleChange} />
                </FormControl>
                <FormControl w={'full'}>
                  <FormLabel>Phone Number</FormLabel>
                  <InputGroup>
                    <InputLeftAddon children={'+91'} />
                    <Input name='customerId' placeholder='Customer Phone Number' value={formik.values.customerId} onChange={formik.handleChange} />
                  </InputGroup>
                </FormControl>
                <FormControl w={'full'}>
                  <FormLabel>Select Bank</FormLabel>
                  <Select name='bankCode' value={formik.values.bankCode} onChange={formik.handleChange}>
                    <option value="SBIN">State Bank of India</option>
                    <option value="bob">Bank of Baroda</option>
                    <option value="hdfc">HDFC Bank</option>
                  </Select>
                </FormControl>
              </Stack>
            </> : null
          }

          <Button colorScheme={'twitter'} onClick={() => getMantra()} isLoading={isBtnLoading}>Submit</Button>
        </Box>

        <Grid
          data={transactions}
          columns={['Date', 'Member ID', 'Transaction ID', "Transaction Type", "Status", "Opening Balance", "Amount", "Closing Balance", "Remarks"]}

        />
      </DashboardWrapper>
    </>
  )
}

export default Aeps