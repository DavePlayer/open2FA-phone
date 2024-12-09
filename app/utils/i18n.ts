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
      qrScanRelayTitle:
        "Scan the QR code to send code through Relay Server directly to App",
      scanQrCode: "Scan QR Code",
      scanRelayQrCode: "Scan Relay QR Code",
      cancelScaning: "Cancel Scaning",
      ConfirmScanTitle: "Confirm Scaned Data",
      issuer: "Issuer",
      refreshPeriod: "Refresh Period",
      hashAlgorithm: "Hash Algorithm",
      label: "Label",
      generatedDigitsLength: "Generated Digids Length",
      confirm: "Confirm",
      cancel: "Cancel",
      setLanguage: "Set language",
      language: "Language",
      exitFile: "Exit File",
      invalidPassword: "Invalid password",
      deleteQuestion: "Are you sure you want to delete service bellow?",
      yes: "Yes",
      no: "No",

      confirmQrScanError: "Error when trying to Confirm scanned QR Code",
      confirmQrScanErrorDetail1:
        "No temporary object to add to your platforms list",

      createFileError: "Error during file creation",

      passwordError: "Password error",
      passwordErrorDetail1: "Invalid Password",

      fieldError: "Field error",
      fieldErrorDetail1: "Password can't be empty",

      fileLoadingError: "Error during file loading",
      fileLoadingCanceled: "Filepicker canceled without file",
      fileLoadingErrorDetail1: "",

      fileCreationError: "Error during file creation",

      noServiceError: "No service found",
      noServiceErrorDetail1: "No service with this label",

      relayQrReadError: "Relay server handling error",

      fileError: "File Error",
      fileDecryptError1: "Invalid File structure",

      fileDecryptionInvalidPassword: "Invalid password",
      fileDecryptionHmacError:
        "Decryption failed: HMAC verification failed. Invalid password",

      bgEncryptionInfo: "Encryption in background",
      bgEncryptionInfoDetail1: "Encrypting token in the background",

      serviceAddonError: "Service addon error",
      serviceAddonSecretError: "Service with provided secret already exists",
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
      qrScanRelayTitle:
        "Zeskanuj kod Qr aby przesłać kod poprzez serwer przekaźnikowy vezpośrednio do aplikacji",
      wrapperMessage1: "Funkcje plików działają w tle",
      wrapperMessage2: "To może chwilę zająć",
      noPlatformsMessage: "Brak zapisanych usług",
      home: "Strona Główna",
      qrScan: "Skan Qr",
      settings: "Ustawienia",
      qrScanTitle:
        "Zeskanuj kod QR na stronie internetowej, na której włączasz 2FA.",
      scanQrCode: "Skanuj kod QR",
      scanRelayQrCode: "Skanuj kod QR do przekaźnika",
      cancelScaning: "Anuluj Skanowanie",
      ConfirmScanTitle: "Potwierdź zeskanowane dane",
      issuer: "Wystawca",
      refreshPeriod: "Czas odświeżania",
      hashAlgorithm: "Algorytm haszujący",
      label: "etykieta",
      generatedDigitsLength: "Długość wygenerowanych cyfr",
      confirm: "Potwierdź",
      cancel: "Anuluj",
      setLanguage: "Ustaw język",
      language: "Język",
      exitFile: "Wyjdź z pliku",
      invalidPassword: "Niepoprawne hasło",
      deleteQuestion: "Jesteś pewny, że chcesz usunąć poniższą usługę?",
      yes: "Tak",
      no: "Nie",

      confirmQrScanError: "Błąd podczas potwierdzania odczytu kodu QR",
      confirmQrScanErrorDetail1:
        "Brak tymczasowego obiektu do oddania do listy",

      createFileError: "Błąd podczas odczytu pliku",

      passwordError: "Błąd hasła",
      passwordErrorDetail1: "NIepoprawne hasło",

      fieldError: "Błąd pola",
      fieldErrorDetail1: "Hasło nie może być puste",

      fileLoadingError: "Błąd podczas ładowania pliku",
      fileLoadingCanceled: "Anulowano wybieranie pliku",
      fileLoadingErrorDetail1: "",

      fileCreationError: "Błąd podczas tworzenia pliku",

      noServiceError: "Nie znaleziono usługi",
      noServiceErrorDetail1: "Brak usługi z wartością label: ",

      relayQrReadError: "Błąd obsługi serwera przekaźnika",

      fileError: "Błąd pliku",
      fileDecryptError1: "Niepoprawna struktura pliku",

      fileDecryptionInvalidPassword: "Niepoprawne hasło",
      fileDecryptionHmacError:
        "Kod Autoryzacji oparty na funkcji skrótu niepoprawny",
      bgEncryptionInfo: "Szyfrowanie działa w tle",
      bgEncryptionInfoDetail1: "Szyforwanie tokenu do przesłąnia działa w tle",

      serviceAddonError: "Błąd dodawania usługi",
      serviceAddonSecretError: "Usługa z takim sekretem już istnieje",
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
