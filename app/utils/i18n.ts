import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { loadFile } from "../redux/globalThunks/loadFile";
import { createFile } from "../redux/globalThunks/createFile";
import toml from "@iarna/toml";

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)

const resources = {
  en: {
    translation: {
      unlockMessage: "Unlock open2FA",
      loadFile: "Load File",
      createFile: "Create File",
      goBack: "Go Back",
      iterations: "Iterations",
      password: "Password",
      createFileInstruction:
        "Here you can create a file in which you store services hashes with which app generates 6 digit codes for 2FA. It will be encrypted with your password, so make sure it is secure. Iterations is a number that dictates how long it takes to crack your password. But be aware that the larger the number, the longer it will take to decrypt it.",
      createFileWarning:
        "After clicking create file you have to wait a few seconds. After that a share prompt will appear in which you can save the file onto your disc or cloud",
      loadFileTitle: "Type password to decrypt file",
      wrapperMessage1: "File functions in progress",
      wrapperMessage2: "It may take a few seconds",
      noPlatformsMessage: "No platforms registered",
      home: "Home",
      qrScan: "Qr Scan",
      settings: "Settings",
      qrScanTitle: "Scan the QR code on the website where you are enabling 2FA",
      scanQrCode: "Scan QR Code",
      cancelScaning: "Cancel Scaning",
      ConfirmScanTitle: "Confirm Scaned Data",
      issuer: "Issuer",
      refreshPeriod: "Refresh Period",
      hashAlgorithm: "Hash Algorithm",
      label: "Label",
      generatedDigitsLength: "Generated Digids Length",
      confirm: "Confirm",
      cancel: "Cancel",
    },
  },
  pl: {
    translation: {
      unlockMessage: "Odblokuj open2FA",
      loadFile: "Załaduj Plik",
      createFile: "Stwórz Plik",
      goBack: "Powrót",
      password: "Hasło",
      iterations: "Iteracje",
      createFileInstruction:
        "Tutaj możesz utworzyć plik, w którym przechowujesz skróty usług, za pomocą których aplikacja generuje 6-cyfrowe kody dla 2FA. Będzie on zaszyfrowany Twoim hasłem, więc upewnij się, że jest bezpieczny. Iteracje to liczba określająca czas potrzebny do złamania hasła. Należy jednak pamiętać, że im większa liczba, tym dłużej zajmie odszyfrowanie hasła.",
      createFileWarning:
        "Po kliknięciu przycisku Utwórz plik należy odczekać kilka sekund. Następnie pojawi się okno udostępniania, w którym można zapisać plik na dysku lub w chmurze.",
      loadFileTitle: "Podaj hasło do odszyfrowania pliku",
      wrapperMessage1: "Funkcje plików działają w tle",
      wrapperMessage2: "To może chwilę zająć",
      noPlatformsMessage: "Brak zapisanych usług",
      home: "Strona Główna",
      qrScan: "Skan Qr",
      settings: "Ustawienia",
      qrScanTitle:
        "Zeskanuj kod QR na stronie internetowej, na której włączasz 2FA.",
      scanQrCode: "Skanuj kod QR",
      cancelScaning: "Anuluj Skanowanie",
      ConfirmScanTitle: "Potwierdź zeskanowane dane",
      issuer: "Wystawca",
      refreshPeriod: "Czas odświeżania",
      hashAlgorithm: "Algorytm haszujący",
      label: "etykieta",
      generatedDigitsLength: "Długość wygenerowanych cyfr",
      confirm: "Potwierdź",
      cancel: "Anuluj",
    },
  },
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: "pl", // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
    // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
    // if you're using a language detector, do not define the lng option

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
