import type { ICredential } from "@interfaces/credentials.interface"

export type CertificateShareModalType = {
   data: ICredential
   isOpen: boolean
   handleCloseModal: () => void
}