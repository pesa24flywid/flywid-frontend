import React, { useEffect, useState } from "react";
import {
  Text,
  HStack,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  VStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  PinInput,
  PinInputField,
  InputGroup,
  InputLeftAddon,
  useToast,
  Select,
  Box
} from "@chakra-ui/react";
import Head from "next/head";
import { Formik, useFormik } from "formik";
import DashboardWrapper from "../../../hocs/DashboardLayout";
import BackendAxios, { FormAxios, DefaultAxios } from "../../../lib/axios";
import { states } from '../../../lib/states'
import { IoMdFingerPrint } from "react-icons/io";
const EditProfile = () => {
  const date = new Date()
  const [profile, setProfile] = useState({
    kycStatus: false,
    fullName: "",
    phone: "NA",
    dob: "NA",
    aadhaarNumber: "NA",
    pan: "NA",
    merchantId: "NA",
    companyName: "NA",
    address: "NA",
  })
  const [isProfileComplete, setIsProfileComplete] = useState(false)
  const [isPhoneOtpDisabled, setIsPhoneOtpDisabled] = useState(true)
  const [isAadhaarOtpDisabled, setIsAadhaarOtpDisabled] = useState(true)
  const [isPanOtpDisabled, setIsPanOtpDisabled] = useState(true)
  const [isPanVerified, setIsPanVerified] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [newPhone, setNewPhone] = useState("")

  const [newAadhaar, setNewAadhaar] = useState("")
  const [aadhaarOtpRefNo, setAadhaarOtpRefNo] = useState("")

  const [newPan, setNewPan] = useState("")
  const [otp, setOtp] = useState("")
  const [phoneModal, setPhoneModal] = useState(false)
  const [aadhaarModal, setAadhaarModal] = useState(false)

  const Toast = useToast({
    position: "top-right",
  })

  // Form Data handling
  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      phone: null,
      email: "",
      dob: "",
      aadhaar: "",
      pan: "",
      firmType: "",
      companyName: "",
      gst: "",
      line: "",
      city: "",
      state: "",
      pincode: "",
      profilePic: null,
      aadhaarFront: null,
      aadhaarBack: null,
      panCard: null,
      modelName: "",
      deviceNumber: "",
    },
    onSubmit: async (values) => {
      // Handle submit
      FormAxios.post('api/user/update', {
        values
      }).then((res) => {
        console.log(res)
        Toast({
          status: 'success',
          title: 'Profile Updated Successfully'
        })
      }).catch((err) => {
        console.log(err)
        Toast({
          status: 'error',
          title: 'Error while updating',
          description: err.response.data.message || err.message,
        })
      })
    },
  });

  const [isPanDisabled, setIsPanDisabled] = useState(false)
  const [isAadhaarDisabled, setIsAadhaarDisabled] = useState(false)

  function fetchProfile() {
    BackendAxios.post("api/user/info").then((res) => {
      localStorage.setItem("kycStatus", res.data.data.kyc)

      localStorage.setItem("firstName", res.data.data.first_name || "")
      formik.setFieldValue("firstName", res.data.data.first_name || "")

      localStorage.setItem("lastName", res.data.data.last_name || "")
      formik.setFieldValue("lastName", res.data.data.last_name || "")

      localStorage.setItem("phone", res.data.data.phone_number || "")
      formik.setFieldValue("phone", res.data.data.phone_number || "")

      localStorage.setItem("userEmail", res.data.data.email || "")
      formik.setFieldValue("email", res.data.data.email || "")

      localStorage.setItem("dob", res.data.data.dob || "")
      formik.setFieldValue("dob", res.data.data.dob || "")

      localStorage.setItem("gst", res.data.data.gst_number || "")
      formik.setFieldValue("gst", res.data.data.gst_number || "")

      localStorage.setItem("aadhaar", res.data.data.aadhaar || "")
      formik.setFieldValue("aadhaar", res.data.data.aadhaar || "")
      setIsAadhaarDisabled(res.data.data.aadhaar ? true : false)

      localStorage.setItem("pan", res.data.data.pan_number || "")
      formik.setFieldValue("pan", res.data.data.pan_number || "")
      setIsPanDisabled(res.data.data.pan_number ? true : false)

      localStorage.setItem("merchantId", res.data.data.user_code || "")

      localStorage.setItem("companyName", res.data.data.company_name || "")
      formik.setFieldValue("companyName", res.data.data.company_name || "")

      localStorage.setItem("firmType", res.data.data.firm_type || "")
      formik.setFieldValue("firmType", res.data.data.firm_type || "")


      localStorage.setItem("line", res.data.data.line || "")
      formik.setFieldValue("line", res.data.data.line || "")

      localStorage.setItem("city", res.data.data.city || "")
      formik.setFieldValue("city", res.data.data.city || "")

      localStorage.setItem("state", res.data.data.state || "")
      formik.setFieldValue("state", res.data.data.state || "")

      localStorage.setItem("pincode", res.data.data.pincode || "")
      formik.setFieldValue("pincode", res.data.data.pincode || "")

      localStorage.setItem("modelName", res.data.data.model_name || "")
      formik.setFieldValue("modelName", res.data.data.model_name || "")

      localStorage.setItem("deviceNumber", res.data.data.device_number || "")
      formik.setFieldValue("deviceNumber", res.data.data.device_number || "")

      setIsProfileComplete(res.data.data.profile === 1)
    }).catch((err) => {
      Toast({
        status: "error",
        title: "Error Occured",
        description: err.message
      })
      console.log(err)
    })
    setProfile({
      ...profile,
      fullName: localStorage.getItem("userName"),
      kycStatus: localStorage.getItem("kycStatus"),
      phone: localStorage.getItem("phone"),
      dob: localStorage.getItem("dob"),
      aadhaarNumber: localStorage.getItem("aadhaar"),
      pan: localStorage.getItem("pan"),
      merchantId: localStorage.getItem("merchantId"),
      companyName: localStorage.getItem("companyName"),
      address: localStorage.getItem("line") + " " + localStorage.getItem("city") + " " + localStorage.getItem("state") + " " + localStorage.getItem("pincode"),
    })
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  useEffect(() => {
    setIsPhoneOtpDisabled(true)
    setIsAadhaarOtpDisabled(true)
    setIsPanOtpDisabled(true)
    if (parseInt(newPhone) > 4000000000) setIsPhoneOtpDisabled(false)
    if (parseInt(newAadhaar) > 100000000000) setIsAadhaarOtpDisabled(false)
    if (!formik.values.pan) {
      setIsPanVerified(false)
    }

  }, [newPhone, newAadhaar])


  async function sendPhoneOtp() {
    BackendAxios.post(`/api/users/otp`, {
      userId: localStorage.getItem("userId"),
      newNumber: newPhone
    }).then((res) => {
      setOtpSent(true)
      Toast({
        status: "success",
        description: `OTP sent to ${newPhone}`
      })
    }).catch((error) => {
      console.log(error)
      Toast({
        status: "error",
        title: `Error Occured`,
        description: error.response.data.message || error.message,
      })
      setOtpSent(false)
    })
  }

  async function verifyPhoneOtp() {
    await BackendAxios.post(`/api/users/verify-otp`, {
      userId: localStorage.getItem("userId"),
      newNumber: newPhone,
      otp: otp
    }).then((res) => {
      if (res.status == 200) {
        setPhoneModal(false)
        formik.setFieldValue("phone", newPhone)
        localStorage.setItem("phone", newPhone)
        Toast({
          status: "success",
          description: 'Phone number updated!'
        })
      }
      setOtpSent(false)
    }).catch((err) => {
      Toast({
        status: "error",
        title: "Error Occured",
        description: "Wrong or Expired OTP"
      })
    })
  }

  // Send OTP for Aadhaar Verification
  function sendAadhaarOtp() {
    BackendAxios.post(`api/user/verify/aadhaar/send-otp`, {
      aadhaar_no: newAadhaar,
    }).then((res) => {
      setOtpSent(true)
      setAadhaarOtpRefNo(res.data.message)
      Toast({
        description: 'OTP sent to aadhaar linked mobile number'
      })
    }).catch((err) => {
      setOtpSent(false)
      Toast({
        status: "error",
        title: "Error Occured",
        description: err.response.data.message || err.response.data || err.message,
      })
      console.log(err)
    })

  }

  // Verifying Aadhaar OTP
  function verifyAadhaarOtp() {
    BackendAxios.post(`api/user/verify/aadhaar/verify-otp`, {
      otp: otp,
      refId: aadhaarOtpRefNo,
    }).then((res) => {
      formik.setFieldValue("aadhaar", newAadhaar)
      localStorage.setItem("aadhaar", newAadhaar)
      Toast({
        status: "success",
        title: "Success",
        description: res.data.message
      })
      setOtpSent(false)
      setOtp("")
    }).catch((err) => {
      Toast({
        status: "error",
        title: "Error Occured",
        description: "Expired or wrong OTP",
      })
      console.log(err)
    })
  }


  // Verifying PAN
  function verifyPan() {
    if (formik.values.firstName && formik.values.lastName && formik.values.pan) {
      BackendAxios.post(`/api/user/verify/pan/verify-pan`, {
        pan_no: formik.values.pan,
      }).then((res) => {
        Toast({
          status: "success",
          title: "PAN Verified",
          description: res.data.response
        })
        setIsPanVerified(true)
        localStorage.setItem("pan", formik.values.pan)
      }).catch((err) => {
        setOtpSent(false)
        Toast({
          status: "error",
          title: "Error Occured",
          description: err.response.data.message || err.response.data || err.message,
        })
        console.log(err)
      })
    }
    else {
      Toast({
        description: "Marked Fields Can't Be Empty"
      })
    }
  }

  function onboardMe() {
    BackendAxios.post('/api/user/pay/onboard-fee').then((res) => {
      Toast({
        status: 'success',
        title: 'Welcome on board!',
        description: 'You can now activate services'
      })
      if (res.data.redirecturl) {
        window.open(res.data.redirecturl, "_blank")
      }
      // setTimeout(() => {
      //     window.location.reload()
      // }, 1000)
    }).catch((err) => {
      console.log(err)
      Toast({
        status: 'error',
        title: 'Error Occured',
        description: err.response.data.message || err.response.data || err.message
      })
    })
  }

  return (
    <>
      <Head>
        <title>Pesa24 - Edit Profile</title>
      </Head>
      <DashboardWrapper titleText="Edit Profile">
        <Stack direction={['column', 'row']} my={4} spacing={4} alignItems={'flex-start'}>
          <Stack
            spacing={4}
            maxW={"4xl"}
            bg={"white"}
            boxShadow={"lg"}
            rounded={"xl"}
            p={[4, 6]}
            mx={'auto'}
          >
            {/* Edit info Form */}
            <Text fontSize={'lg'} pb={2} fontWeight={'medium'} color={'#333'}>Personal Details</Text>
            <Stack direction={["column", "row"]} spacing="8">
              <FormControl py={2} id="firstName" isRequired>
                <FormLabel>First Name</FormLabel>
                <Input
                  placeholder="First Name"
                  _placeholder={{ color: "gray.500" }}
                  type="text" disabled
                  value={formik.values.firstName}
                  onChange={formik.handleChange}
                />
              </FormControl>
              <FormControl py={2} id="lastName" isRequired>
                <FormLabel>Last Name</FormLabel>
                <Input
                  placeholder="Last Name"
                  _placeholder={{ color: "gray.500" }}
                  type="text" disabled
                  value={formik.values.lastName}
                  onChange={formik.handleChange}
                />
              </FormControl>
            </Stack>
            <Stack direction={["column", "row"]} spacing="8">
              <FormControl py={2} id="Email" isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                  _placeholder={{ color: "gray.500" }}
                  type="text"
                  value={formik.values.email}
                  disabled
                />
              </FormControl>
              <FormControl py={2} id="phone" isRequired>
                <FormLabel>Contact Number</FormLabel>
                <Input
                  placeholder="Phone number"
                  _placeholder={{ color: "gray.500" }}
                  type="number"
                  value={formik.values.phone}
                  // onClick={() => setPhoneModal(true)}
                  readOnly
                  disabled
                  cursor={'pointer'}
                />
              </FormControl>
            </Stack>
            <Stack direction={["column", "row"]} spacing="8">
              <FormControl py={2} id="dob" w={['xs']} isRequired>
                <FormLabel>Date of Birth</FormLabel>
                <Input
                  placeholder="dd/mm/yyyy"
                  _placeholder={{ color: "gray.500" }}
                  type="date" value={formik.values.dob}
                  max={`${date.getFullYear() - 18}-${(date.getMonth() + 1).toLocaleString('en-US', {
                    minimumIntegerDigits: 2
                  })}-${date.getDate().toLocaleString('en-US', {
                    minimumIntegerDigits: 2
                  })}`}
                  // value={formik.values.dob}
                  // onChange={formik.handleChange},
                  disabled
                />
              </FormControl>
            </Stack>
            <Stack direction={["column", "row"]} spacing="8">
              <FormControl py={2} id="verifiedAadhaar" isRequired>
                <FormLabel>Aadhar Number</FormLabel>
                <Input
                  placeholder="Aadhar number"
                  _placeholder={{ color: "gray.500" }}
                  type="number" readOnly cursor={'pointer'}
                  value={formik.values.aadhaar}
                  onClick={() => isAadhaarDisabled || setAadhaarModal(true)}
                  disabled={isAadhaarDisabled}
                />
              </FormControl>
              <FormControl py={2} id="pan" isRequired>
                <FormLabel>Your PAN</FormLabel>
                <Input
                  name={'pan'} isDisabled={isPanVerified}
                  placeholder="Peresonal Account Number"
                  _placeholder={{ color: "gray.500" }}
                  value={formik.values.pan}
                  onChange={formik.handleChange}
                  textTransform={'uppercase'}
                  disabled={isPanDisabled}
                />
                <HStack p={2} justifyContent={'flex-end'}>
                  <Button
                    size={'xs'}
                    colorScheme={'twitter'}
                    isDisabled={isPanDisabled ? true : formik.values.pan.length !== 10}
                    onClick={verifyPan}
                  >Verify</Button>
                </HStack>
              </FormControl>
            </Stack>

            <VStack alignItems={'flex-start'} py={8}>
              <Text fontSize={'lg'} pb={2} fontWeight={'medium'} color={'#333'}>Business Details</Text>

              <Stack direction={['column', 'row']} spacing={8}>
                <FormControl py={2} id="firmType">
                  <FormLabel>Company name</FormLabel>
                  <Input
                    placeholder="Company name"
                    _placeholder={{ color: "gray.500" }}
                    type="text" name="firmType"
                    value={formik.values.firmType}
                    onChange={formik.handleChange}
                  />
                </FormControl>
                <FormControl py={2} id="companyName">
                  <FormLabel>Company Type</FormLabel>
                  <Select
                    name="companyName" placeholder="Select here"
                    value={formik.values.firmType} onChange={formik.handleChange}
                  >
                    <option value="proprietorship">Sole Propriortship</option>
                    <option value="private limited">Private Limited</option>
                    <option value="partnership">Partnership</option>
                  </Select>
                </FormControl>
              </Stack>
              <FormControl py={2} id="gst" w={['xs']}>
                <FormLabel>GST Number</FormLabel>
                <Input
                  placeholder="GST Number"
                  _placeholder={{ color: "gray.500" }}
                  type="text" name="gst"
                  value={formik.values.gst}
                  onChange={formik.handleChange}
                />
              </FormControl>
            </VStack>

            <VStack alignItems={'flex-start'} py={8}>
              <Text fontSize={'lg'} pb={2} fontWeight={'medium'} color={'#333'}>Address Details</Text>
              <Stack direction={['column', 'row']} w={'full'} spacing={8}>
                <FormControl py={2} id="line" isRequired>
                  <FormLabel>Street Address</FormLabel>
                  <Input
                    placeholder="Enter here..."
                    _placeholder={{ color: "gray.500" }}
                    type="text"
                    value={formik.values.line}
                    // onChange={formik.handleChange}
                    disabled
                  />
                </FormControl>
              </Stack>
              <Stack direction={['column', 'row']} spacing={8}>
                <FormControl py={2} id="city" isRequired>
                  <FormLabel>City</FormLabel>
                  <Input
                    placeholder="Enter here..."
                    _placeholder={{ color: "gray.500" }}
                    type="text"
                    value={formik.values.city}
                    // onChange={formik.handleChange}
                    disabled
                  />
                </FormControl>
                <FormControl py={2} id="pincode" isRequired>
                  <FormLabel>Pincode</FormLabel>
                  <Input
                    placeholder="Enter here..."
                    _placeholder={{ color: "gray.500" }}
                    type="text"
                    value={formik.values.pincode}
                    onChange={formik.handleChange}
                  // disabled
                  />
                </FormControl>
                <FormControl py={2} id="state" isRequired>
                  <FormLabel>State</FormLabel>
                  <Select name="state" placeholder="Select State" value={formik.values.state}
                    // onChange={formik.handleChange}
                    disabled
                  >
                    {states.map((state, key) => {
                      return (
                        <option value={state} key={key}>{state}</option>
                      )
                    })}
                  </Select>
                </FormControl>
              </Stack>
            </VStack>


            <VStack
              alignItems={'flex-start'}
              py={8} w={'full'}
            >
              <Text fontSize={'lg'} pb={2} fontWeight={'medium'} color={'#333'}>Biometric Device Details</Text>

              <Stack
                direction={['column', 'row']}
                alignItems={'flex-end'}
                spacing={4} py={2} w={'full'}
              >
                <FormControl id="modelName" w={'xs'} isRequired>
                  <FormLabel>Model Name</FormLabel>
                  <Input
                    placeholder="Enter here..."
                    _placeholder={{ color: "gray.500" }}
                    value={formik.values.modelName}
                    onChange={formik.handleChange}
                  />
                </FormControl>
                <FormControl id="deviceNumber" w={'xs'} isRequired>
                  <FormLabel>Device Number</FormLabel>
                  <Input
                    placeholder="Enter here..."
                    _placeholder={{ color: "gray.500" }}
                    value={formik.values.deviceNumber}
                    onChange={formik.handleChange}
                  />
                </FormControl>
                <Box>
                  <Button
                    colorScheme="whatsapp"
                    leftIcon={<IoMdFingerPrint />}
                    onClick={onboardMe}
                    isDisabled={!isProfileComplete}
                  >Register Device</Button>
                  {isProfileComplete ||
                    <Text fontSize={'xs'} color={'darkslategray'}>Save your details first</Text>
                  }
                </Box>
              </Stack>
            </VStack>


            <Stack spacing={6} direction={["column", "row"]}>
              <Button
                bg={"red.400"}
                color={"white"}
                w="full"
                _hover={{
                  bg: "red.500",
                }}
              >
                Cancel
              </Button>
              <Button
                bg={"blue.400"}
                color={"white"}
                w="full"
                _hover={{
                  bg: "blue.500",
                }}
                onClick={formik.handleSubmit}
              >
                Submit
              </Button>
            </Stack>
          </Stack>

          <Stack w={['full', 'sm']} rounded={12} bg={'white'} p={4} boxShadow={'lg'}>
            <Text fontSize={'lg'} fontWeight={'medium'} color={'#333'}>Upload Documents</Text>
            <Stack direction={["column"]} spacing="6" pb={6}>
              <FormControl py={2} id="profilePic" isRequired>
                <FormLabel>Profile Picture</FormLabel>
                <Input
                  type="file"
                  onChange={(e) => formik.setFieldValue("profilePic", e.currentTarget.files[0])}
                  accept={"image/png, image/jpg, image/jpeg"}
                />
              </FormControl>
              <FormControl py={2} id="panCard" isRequired>
                <FormLabel>Pan Card</FormLabel>
                <Input
                  type="file"
                  onChange={(e) => formik.setFieldValue("panCard", e.currentTarget.files[0])}
                  accept={"image/png, image/jpg, image/jpeg, application/pdf"}
                />
              </FormControl>
            </Stack>
            <Stack direction={["column"]} spacing="6" pb={6}>
              <FormControl py={2} id="eAadharBack" isRequired>
                <FormLabel>eAadhar (Back)</FormLabel>
                <Input
                  type="file"
                  onChange={(e) => formik.setFieldValue("aadhaarBack", e.currentTarget.files[0])}
                  accept={"image/png, image/jpg, image/jpeg, application/pdf"}
                />
              </FormControl>
              <FormControl py={2} id="eAadharFront" isRequired>
                <FormLabel>eAadhar (Front)</FormLabel>
                <Input
                  type="file"
                  onChange={(e) => formik.setFieldValue("aadhaarFront", e.currentTarget.files[0])}
                  accept={"image/png, image/jpg, image/jpeg, application/pdf"}
                />
              </FormControl>
            </Stack>
            {/* <Button colorScheme={'orange'} onClick={profileFormik.handleSubmit}>Upload</Button> */}
          </Stack>
        </Stack>
      </DashboardWrapper>

      {/* Phone Number Addition */}
      <Modal isOpen={phoneModal} onClose={() => { setPhoneModal(false); setOtpSent(false) }} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader>
            Add New Phone Number
          </ModalHeader>
          <ModalBody>
            <InputGroup>
              <InputLeftAddon children={"+91"} />
              <Input type={'tel'} maxLength={10} placeholder={'Your Phone Number'} value={newPhone} onChange={(e) => setNewPhone(e.target.value)} />
            </InputGroup>
            <HStack justifyContent={'flex-end'} py={2}>
              <Button colorScheme={'twitter'} disabled={isPhoneOtpDisabled} size={'xs'} onClick={sendPhoneOtp}>Send OTP</Button>
            </HStack>

            <VStack display={otpSent ? "flex" : "none"}>
              <Text>Enter OTP</Text>
              <HStack py={2}>
                <PinInput otp onComplete={(value) => setOtp(value)}>
                  <PinInputField />
                  <PinInputField />
                  <PinInputField />
                  <PinInputField />
                </PinInput>
              </HStack>
              <Button colorScheme={'twitter'} onClick={verifyPhoneOtp}>Verify</Button>
            </VStack>

          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Aadhaar Number Add */}
      <Modal isOpen={aadhaarModal} onClose={() => { setAadhaarModal(false); setOtpSent(false) }} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader>
            Add Your Aadhaar
          </ModalHeader>
          <ModalBody>
            <Input type={'tel'} placeholder={'Your Aadhaar Number'} maxLength={12} value={newAadhaar} onChange={(e) => setNewAadhaar(e.target.value)} />
            <HStack justifyContent={'flex-end'} py={2}>
              <Button colorScheme={'twitter'} disabled={isAadhaarOtpDisabled} size={'xs'} onClick={sendAadhaarOtp}>Send OTP</Button>
            </HStack>

            <VStack display={otpSent ? "flex" : "none"}>
              <Text>Enter OTP</Text>
              <HStack py={2}>
                <PinInput otp onComplete={(value) => setOtp(value)}>
                  <PinInputField />
                  <PinInputField />
                  <PinInputField />
                  <PinInputField />
                  <PinInputField />
                  <PinInputField />
                </PinInput>
              </HStack>
              <Button colorScheme={'twitter'} onClick={verifyAadhaarOtp}>Verify</Button>
            </VStack>

          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default EditProfile;
