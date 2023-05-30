import React, { useEffect, useState } from 'react'
import DashboardWrapper from '../../../../hocs/DashboardLayout'
import {
  useToast,
  Box,
  Button,
  HStack,
  VisuallyHidden
} from '@chakra-ui/react'
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { BsChevronDoubleLeft, BsChevronDoubleRight, BsChevronLeft, BsChevronRight } from 'react-icons/bs'
import BackendAxios from '../../../../lib/axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable'

const ExportPDF = () => {
  const doc = new jsPDF('landscape')

  doc.autoTable({ html: '#printable-table' })
  doc.output('dataurlnewwindow');
}

const Index = () => {
  const Toast = useToast({
    position: 'top-right'
  })
  const [printableRow, setPrintableRow] = useState([])
  const [pagination, setPagination] = useState({
    current_page: "1",
    total_pages: "1",
    first_page_url: "",
    last_page_url: "",
    next_page_url: "",
    prev_page_url: "",
  })
  const [rowData, setRowData] = useState([

  ])
  const [columnDefs, setColumnDefs] = useState([
    {
      headerName: "Trnxn ID",
      field: 'transaction_id'
    },
    {
      headerName: "Amount",
      field: 'amount'
    },
    {
      headerName: "Status",
      field: 'status'
    },
    {
      headerName: "Transaction Type",
      field: 'transaction_type'
    },
    {
      headerName: "Transaction Date",
      field: 'transaction_date'
    },
    {
      headerName: "Request Timestamp",
      field: 'created_at'
    },
    {
      headerName: "Remarks",
      field: 'remarks',
      defaultMinWidth: 300
    },
  ])

  function fetchTransactions(pageLink) {
    BackendAxios.get(pageLink || `/api/fund/fetch-fund?page=1`).then((res) => {
      setPagination({
        current_page: res.data.current_page,
        total_pages: parseInt(res.data.last_page),
        first_page_url: res.data.first_page_url,
        last_page_url: res.data.last_page_url,
        next_page_url: res.data.next_page_url,
        prev_page_url: res.data.prev_page_url,
      })
      setPrintableRow(res.data.data)
      setRowData(res.data.data)
    }).catch((err) => {
      console.log(err)
      Toast({
        status: 'error',
        description: err.response.data.message || err.response.data || err.message
      })
    })
  }

  useEffect(() => {
    fetchTransactions()
  }, [])


  return (
    <>
    <DashboardWrapper pageTitle={'Fund Requests Reports'}>
    <HStack>
      <Button onClick={ExportPDF} colorScheme={'red'} size={'sm'}>Export PDF</Button>
    </HStack>
      <HStack spacing={2} py={4} mt={24} bg={'white'} justifyContent={'center'}>
        <Button
          colorScheme={'twitter'}
          fontSize={12} size={'xs'}
          variant={'outline'}
          onClick={() => fetchTransactions(pagination.first_page_url)}
        ><BsChevronDoubleLeft />
        </Button>
        <Button
          colorScheme={'twitter'}
          fontSize={12} size={'xs'}
          variant={'outline'}
          onClick={() => fetchTransactions(pagination.prev_page_url)}
        ><BsChevronLeft />
        </Button>
        <Button
          colorScheme={'twitter'}
          fontSize={12} size={'xs'}
          variant={'solid'}
        >{pagination.current_page}</Button>
        <Button
          colorScheme={'twitter'}
          fontSize={12} size={'xs'}
          variant={'outline'}
          onClick={() => fetchTransactions(pagination.next_page_url)}
        ><BsChevronRight />
        </Button>
        <Button
          colorScheme={'twitter'}
          fontSize={12} size={'xs'}
          variant={'outline'}
          onClick={() => fetchTransactions(pagination.last_page_url)}
        ><BsChevronDoubleRight />
        </Button>
      </HStack>
      <Box py={6}>
        <Box className='ag-theme-alpine' w={'full'} h={['2xl']}>
          <AgGridReact
            columnDefs={columnDefs}
            rowData={rowData}
            defaultColDef={{
              filter: true,
              floatingFilter: true,
              resizable: true,
              sortable: true,
            }}
            onFilterChanged={
              (params) => {
                setPrintableRow(params.api.getRenderedNodes().map((item) => {
                  return (
                    item.data
                  )
                }))
              }
            }
          >

          </AgGridReact>
        </Box>
      </Box>
    </DashboardWrapper>


<VisuallyHidden>
  <table id='printable-table'>
    <thead>
      <tr>
        <th>#</th>
        {
          columnDefs.filter((column) => {
            if (
              column.field != "metadata" &&
              column.field != "name" &&
              column.field != "receipt" 
            ) {
              return (
                column
              )
            }
          }).map((column, key) => {
            return (
              <th key={key}>{column.headerName}</th>
            )
          })
        }
      </tr>
    </thead>
    <tbody>
      {
        printableRow.map((data, key) => {
          return (
            <tr key={key}>
              <td>{key + 1}</td>
              <td>{data.transaction_id}</td>
              <td>{data.debit_amount}</td>
              <td>{data.credit_amount}</td>
              <td>{data.opening_balance}</td>
              <td>{data.closing_balance}</td>
              <td>{data.service_type}</td>
              <td>{JSON.parse(data.metadata).status ? "SUCCESS" : "FAILED"}</td>
              <td>{data.created_at}</td>
              <td>{data.updated_at}</td>
            </tr>
          )
        })
      }
    </tbody>
  </table>
</VisuallyHidden>
    </>
  )
}

export default Index