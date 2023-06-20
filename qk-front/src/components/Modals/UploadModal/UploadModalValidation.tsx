import React from "react"

import { UploadModalValidationItem } from "@components/Modals/UploadModal/UploadModalValidationItem"
import { Button, Text } from "@lib/components"

import type { UploadModalValidationType } from "@customTypes/components/Modals"

export const UploadModalValidation: React.FC<UploadModalValidationType> = ({
   validationErrors,
   handleNextStep
}): JSX.Element => {

   const [isValidationPassed, setIsValidationPassed] = React.useState<"pass" | "no-pass" | null>(null)

   /**
    * Validation error UI handler
    */
   React.useEffect(() => {
      if (validationErrors.some(item => item.errors.length > 0)) {
         setIsValidationPassed("no-pass")

      } else {
         setIsValidationPassed("pass")
      }
   }, [validationErrors])

   return (
      <div>

         {validationErrors.map(item => (
            <UploadModalValidationItem key={item.columnName} columnName={item.columnName} errors={item.errors}/>
         ))}

         {isValidationPassed === "no-pass" && <Text color="danger" component="p" size="paragraph"
                                                    style={{ marginTop: "2.4rem", textAlign: "center" }}>
            Please make necessary changes and re-submit the file.
         </Text>}

         {isValidationPassed === "pass" && <Button center loading={false} size="lg"
                                                   variant="primary"
                                                   onClick={handleNextStep}>Continue</Button>}

      </div>
   )
}