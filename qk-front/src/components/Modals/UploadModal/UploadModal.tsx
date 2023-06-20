import React from "react"

import dynamic from "next/dynamic"
import { useRouter } from "next/router"
import Papa from "papaparse"
import readXlsxFile from "read-excel-file"

import { qualkeyUploadMapping } from "@constants/qualkeyUploadMapping"
import { colorBrandBlue24, colorPending } from "@constants/styles"
import { FileExtensionEnum } from "@customTypes/components/Modals"
import { useUploadDataValidation } from "@hooks/useUploadDataValidation"
import { Button, Heading, Modal, Text } from "@lib/components"

import type {
   UploadModalMappingFormType,
   UploadModalType,
   UploadModalValidationType
} from "@customTypes/components/Modals"
import type { InstitutionMappingType } from "@interfaces/institution.interface"

const UploadModalValidation = dynamic<UploadModalValidationType>(() => import("@components/Modals").then(module => module.UploadModalValidation))
const UploadModalMappingForm = dynamic<UploadModalMappingFormType>(() => import("@components/Modals").then(module => module.UploadModalMappingForm))

const totalSteps = 4

export const UploadModal: React.FC<UploadModalType> = ({ isOpen, handleCloseModal, institutionData }): JSX.Element => {

   const router = useRouter()

   const ref = React.useRef<HTMLInputElement>(null)

   const [activeStep, setActiveStep] = React.useState<number>(1)
   const [selectFileError, setSelectFileError] = React.useState<string>("")
   const [selectedFile, setSelectedFile] = React.useState<File | null>(null)
   const [parsingErrors, setParsingErrors] = React.useState<Papa.ParseError[] | null>(null)
   const [parsedFields, setParsedFields] = React.useState<string[] | undefined>(undefined)
   const [mappingIntersection, setMappingIntersection] = React.useState<InstitutionMappingType[] | null>(null)

   const [data, validationErrors, handleValidation] = useUploadDataValidation()

   /**
    * Click button for file select handler
    */
   const handleSelectFileWindow = (): void => {
      if (ref.current) {
         ref.current.click()

      } else {
         setSelectFileError("Unable to select file, please contact support")
      }
   }

   /**
    * Validate and parse file handler
    */
   const handleGetFile = (event: React.ChangeEvent<HTMLInputElement>): void => {
      if (event.target.files && event.target.files.length) {
         const fileExtension = event.target.files[0].name.split(".").pop()

         if (fileExtension) {

            if (Object.values(FileExtensionEnum).includes(fileExtension as FileExtensionEnum)) {
               setSelectFileError("")
               setSelectedFile(event.target.files[0])

               if (fileExtension === FileExtensionEnum.CSV) {

                  if (institutionData?.mapping) {
                     Papa.parse(event.target.files[0], {
                        header: true,
                        skipEmptyLines: true,

                        complete: (results) => {
                           const filterMetaFields = results.meta.fields?.filter(field => field !== "")
                           setParsedFields(filterMetaFields)
                           if (results.errors.length) {
                              setActiveStep(0)
                              setParsingErrors(results.errors)

                           } else {

                              if (filterMetaFields) {
                                 const mappingDifference = institutionData?.mapping.filter(
                                    data => !results.meta.fields?.includes(data.originalColumnName)
                                 )

                                 if (mappingDifference && mappingDifference.length > 0) {
                                    setActiveStep(0)
                                    setMappingIntersection(mappingDifference)

                                 } else {
                                    handleValidation(institutionData.mapping, results.data as { [k: string]: string }[])
                                    setActiveStep(prevState => prevState + 1)
                                 }

                              } else {
                                 setSelectFileError("Unable to parse columns, please contact support")
                              }

                           }
                        },
                        error: (err) => {
                           setSelectFileError(`${err.message}. Unexpected error, please contact support`)
                        }
                     })

                  } else {
                     setSelectFileError("Please add Institution mapping in Admin Panel")
                  }

               } else if (fileExtension === FileExtensionEnum.XLSX) {

                  if (institutionData?.mapping) {

                     readXlsxFile(event.target.files[0], { trim: false })
                        .then(rows => {
                           const isEmptyColumns = rows[0].some(field => field === null)

                           if (isEmptyColumns) {
                              setSelectFileError("Please remove empty columns and try again")

                           } else {
                              const fields = rows[0] as string[]
                              setParsedFields(fields)
                              rows.shift()
                              const parsedData = rows.map(row => {
                                 return Object.fromEntries(fields.map((_, i) => [fields[i], row[i]]))
                              })

                              const mappingDifference = institutionData?.mapping.filter(
                                 data => !fields.includes(data.originalColumnName)
                              )

                              if (mappingDifference && mappingDifference.length > 0) {
                                 setActiveStep(0)
                                 setMappingIntersection(mappingDifference)

                              } else {
                                 handleValidation(institutionData.mapping, parsedData as { [k: string]: string }[], true)
                                 setActiveStep(prevState => prevState + 1)
                              }
                           }

                        })

                        .catch(err => {
                           setSelectFileError(`${err.message}. Unexpected error, please contact support`)
                        })

                  } else {
                     setSelectFileError("Please add Institution mapping in Admin Panel")
                  }

               } else if (fileExtension === FileExtensionEnum.XLS) {
                  setSelectFileError("Not possible to upload .xls file, please use .xlsx instead")

               } else {
                  setSelectFileError("Not possible to upload file. Please contact support")
               }

            } else {
               setSelectFileError("Make sure you have selected a valid .csv/.xls/.xlsx file")
            }

         } else {
            setSelectFileError("Unable to select file, please contact support")
         }

      } else {
         setSelectFileError("Unable to select file, please contact support")
      }
   }

   /**
    * Next step handler
    */
   const handleNextStep = (): void => {
      setActiveStep(prevState => prevState + 1)
   }

   /**
    * Go back to dashboard handler
    */
   const handleReturnToDashboard = (): void => {
      handleCloseModal()
      router.reload()
   }

   return (
      <Modal stepsRequired activeStep={activeStep} handleCloseModal={handleCloseModal}
             isOpen={isOpen}
             style={{ overflowY: "scroll" }} totalSteps={totalSteps}>

         {activeStep === 1 && <>
            <Heading color="blue" component="h3" size="md">
               Multi-Upload
            </Heading>
            <Text color="800" component="p" size="paragraph">
               Please, select .csv/.xls/.xlsx file from your computer and upload it
            </Text>
            <Button center error={selectFileError} icon={<svg fill="none" height="24" viewBox="0 0 24 24"
                                                              width="24" xmlns="http://www.w3.org/2000/svg">
               <path d="M18.75 21H5.25C5.05109 21 4.86032 20.921 4.71967 20.7803C4.57902 20.6397 4.5 20.4489 4.5 20.25V3.75C4.5 3.55109 4.57902 3.36032 4.71967 3.21967C4.86032 3.07902 5.05109 3 5.25 3H14.25L19.5 8.25V20.25C19.5 20.4489 19.421 20.6397 19.2803 20.7803C19.1397 20.921 18.9489 21 18.75 21Z"
                  stroke="white" strokeLinecap="round" strokeLinejoin="round"
                  strokeWidth="1.5"/>
               <path d="M14.25 3V8.25H19.5" stroke="white" strokeLinecap="round"
                     strokeLinejoin="round"
                     strokeWidth="1.5"/>
               <path d="M9.375 13.875L12 11.25L14.625 13.875" stroke="white" strokeLinecap="round"
                     strokeLinejoin="round" strokeWidth="1.5"/>
               <path d="M12 17.25V11.25" stroke="white" strokeLinecap="round"
                     strokeLinejoin="round"
                     strokeWidth="1.5"/>
            </svg>}
                    loading={false}
                    size="lg"
                    type="file"
                    variant="primary"
                    onClick={handleSelectFileWindow}>
               Press here to upload a file
            </Button>
            <input ref={ref} style={{ visibility: "hidden" }} type="file"
                   onChange={handleGetFile}/>
         </>}

         {activeStep === 2 && <>
            <Heading color="blue" component="h3" size="md">
               Your upload is being checked
            </Heading>
            <Text color="800" component="p" size="paragraph"
                  style={{ marginBottom: "3.2rem" }}>
               We have reviewed each field in a file to make sure fields are valid
            </Text>

            <UploadModalValidation handleNextStep={handleNextStep} validationErrors={validationErrors}/>
         </>}

         {activeStep === 3 && <>
            <Heading color="blue" component="h3" size="md">
               Multi-Upload
            </Heading>
            <Text color="800" component="p" size="paragraph"
                  style={{ marginBottom: "2.4rem" }}>
               Please double check all required fields before completing the upload process
            </Text>

            <UploadModalMappingForm fields={data} handleCloseModal={handleCloseModal} handleNextStep={handleNextStep}
                                    selectedFile={selectedFile}/>
         </>}

         {activeStep === 4 && <>
            <Heading color="blue" component="h3" size="md">
               Multi-Upload
            </Heading>
            <Text color="800" component="p" size="paragraph"
                  style={{ marginBottom: "2.4rem" }}>
               You will be notified as soon as you organisation’s Assigned Approver confirms these credentials.<br/>
               You may now return to the dashboard
            </Text>
            <Button center loading={false} size="lg"
                    variant="primary"
                    onClick={handleReturnToDashboard}>
               Return to dashboard
            </Button>
         </>}

         {parsingErrors && <>
            <Heading color="danger" component="h3" size="md">
               Parsing Error
            </Heading>

            <Text color="danger" component="p" size="paragraph"
                  style={{ marginBottom: ".8rem" }}>
               Looking for these fields:
            </Text>
            <div style={{ marginBottom: "1.2rem", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: ".4rem" }}>
               {parsedFields?.map((field, index) => (
                  <Text key={field + index} color="800" component="p"
                        size="label">
                     {index + 1}. &ldquo;{field}&rdquo;
                  </Text>
               ))}
            </div>

            <Text color="danger" component="p" size="paragraph"
                  style={{ marginBottom: ".8rem" }}>
               Error list:
            </Text>
            {parsingErrors.map((err, index) => (
               <Text key={err.row + err.code} color="800" component="p"
                     size="paragraph">
                  {index + 1}. Row {err.row} - {err.message}.
               </Text>
            ))}
         </>}

         {mappingIntersection && <>
            <Heading color="danger" component="h3" size="md">
               Column names do not match
            </Heading>
            <Text color="danger" component="p" size="paragraph"
                  style={{ marginBottom: ".8rem" }}>
               Looking for these fields:
            </Text>
            <div style={{ marginBottom: "1.2rem", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: ".4rem" }}>
               {parsedFields?.map((field, index) => (
                  <Text key={field + index} color="800" component="p"
                        size="label">
                     {index + 1}. &ldquo;{field}&rdquo;
                  </Text>
               ))}
            </div>
            <Text color="800" component="p" size="paragraph">
               There are wrong values for these columns in a file:
            </Text>
            <div style={{ margin: "1.2rem 0" }}>

               {mappingIntersection.map((value, index) => {
                  const qualkeyField = qualkeyUploadMapping.get(value.qualkeyName)

                  if (qualkeyField) return (
                     <React.Fragment key={value.qualkeyName + index}>
                        <Text color="800" component="p"
                              size="paragraph">
                           {index + 1}.
                           For column <span style={{ color: colorBrandBlue24 }}>&ldquo;{qualkeyField}&rdquo;</span>
                           &nbsp;you provided <span style={{ color: colorPending }}>&ldquo;{value.originalColumnName}&rdquo;</span>
                        </Text>
                     </React.Fragment>
                  )
                  else return (
                     <Text key={index} color="danger" component="p"
                           size="paragraph">
                        {index + 1}. Not possible to get field, seems like it is empty
                     </Text>
                  )
               })}

            </div>
            <Text bold color="800" component="p"
                  size="paragraph">
               Please, double check mapping values in admin panel.
            </Text>
         </>}


      </Modal>
   )
}