export type UseLogoutType = [
   boolean,
   ((value: (((prevState: boolean) => boolean) | boolean)) => void),
   string,
   (() => Promise<void>)
]
