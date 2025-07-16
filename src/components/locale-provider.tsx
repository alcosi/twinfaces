"use client";

import deepmerge from "deepmerge";
import { NextIntlClientProvider } from "next-intl";
import React, { createContext, useContext, useState } from "react";

type LocaleContextType = {
  locale: string;
  changeLocale: (newLocale: string) => void;
};

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export const useLocale = () => {
  const context = useContext(LocaleContext);
  if (!context) throw new Error("useLocale must be used within LocaleProvider");
  return context;
};

export const LocaleProvider = ({
  children,
  initialLocale,
  initialMessages,
}: {
  children: React.ReactNode;
  initialLocale: string;
  initialMessages: any;
}) => {
  const [locale, setLocale] = useState(initialLocale);
  const [messages, setMessages] = useState(initialMessages);

  const changeLocale = async (newLocale: string) => {
    localStorage.setItem("locale", newLocale);
    const newMessages = await import(`../../messages/${newLocale}.json`);

    const fallbackMessages = await import(`../../messages/en.json`);
    const mergedMessages = deepmerge(fallbackMessages, newMessages);

    setLocale(newLocale);
    setMessages(mergedMessages.default);
  };

  return (
    <LocaleContext.Provider value={{ locale, changeLocale }}>
      <NextIntlClientProvider messages={messages} locale={locale}>
        {children}
      </NextIntlClientProvider>
    </LocaleContext.Provider>
  );
};
