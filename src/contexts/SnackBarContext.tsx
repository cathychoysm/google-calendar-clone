"use client";

import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";

type SnackBarContextType = {
  isOpenSnackBar: boolean;
  setIsOpenSnackBar: Dispatch<SetStateAction<boolean>>;
};

const SnackBarContext = createContext<SnackBarContextType>({
  isOpenSnackBar: false,
  setIsOpenSnackBar: () => {},
});

export default function useSnackBarContext() {
  return useContext(SnackBarContext);
}

export const SnackBarContextProvider = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [isOpenSnackBar, setIsOpenSnackBar] = useState<boolean>(false);

  return (
    <SnackBarContext.Provider
      value={{
        isOpenSnackBar,
        setIsOpenSnackBar,
      }}
    >
      {children}
    </SnackBarContext.Provider>
  );
};
