import type { ICredential, ICredentialSharePage } from "@interfaces/credentials.interface"

export type CertificateType = {
   data: ICredential | ICredentialSharePage
   showQR: boolean
}