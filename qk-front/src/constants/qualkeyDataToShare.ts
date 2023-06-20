import type { QualkeyDataToShareType } from "@customTypes/constants"

export const qualkeyDataToShare: QualkeyDataToShareType[] = [
   {
      title: "Qualification Level",
      value: "qualificationLevel"
   }, {
      title: "Award Level",
      value: "awardLevel"
   },
   {
      title: "Study Language",
      value: "studyLanguage"
   }, {
      title: "Info",
      value: "info"
   }, {
      title: "Minors",
      value: "minors"
   }, {
      title: "Majors",
      value: "majors"
   }, {
      title: "GPA Final Grade",
      value: "gpaFinalGrade"
   }, {
      title: "Study Started At",
      value: "studyStartedAt"
   }, {
      title: "Study Ended At",
      value: "studyEndedAt"
   }, {
      title: "Graduated At",
      value: "graduatedAt"
   }, {
      title: "Expires At",
      value: "expiresAt"
   }
].sort((a, b) => a.title.localeCompare(b.title))