"use client";

import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";

type CreateEventModalContextType = {
  isOpenModal: boolean;
  setIsOpenModal: Dispatch<SetStateAction<boolean>>;
};

const CreateEventModalContext = createContext<CreateEventModalContextType>({
  isOpenModal: false,
  setIsOpenModal: () => {},
});

export default function useCreateEventModalContext() {
  return useContext(CreateEventModalContext);
}

export const CreateEventModalContextProvider = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

  return (
    <CreateEventModalContext.Provider
      value={{
        isOpenModal,
        setIsOpenModal,
      }}
    >
      {children}
    </CreateEventModalContext.Provider>
  );
};
