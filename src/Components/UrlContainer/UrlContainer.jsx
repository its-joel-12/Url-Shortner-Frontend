import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import "./UrlContainer.css";
import { FaLink } from "react-icons/fa";
import LinkResult from "../LinkResult/LinkResult";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import FormHelperText from "@mui/material/FormHelperText";
import Popup from "../Popup/Popup";
import CryptoJS from "crypto-js";

const schema = yup.object().shape({
  longurl: yup
    .string()
    .required("URL is required")
    .matches(/^https:\/\/.*/i, "URL must start with https://")
    .matches(
      /^https:\/\/[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+/,
      "Invalid domain format"
    )
    .matches(
      /^https:\/\/[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+\/.{8,}$/,
      "Enter a valid URL. Must contain more than 8 characters after the domain and '/'"
    )
    .max(2000, "URL is too long. Maximum length is 2000 characters.")
    .trim()
    .matches(/^\S+$/, "URL should not contain any spaces")
    .matches(
      /^(?!https:\/\/yourl\.accelyazapcg\.com).*$/i,
      "This URL is not allowed"
    )
    .matches(
      /^[^{}|]*$/i,
      "URL should not contain the characters '{', '}', or '|'"
    ),
});

const UrlContainer = () => {
  const [shortenLink, setShortenLink] = useState("");
  const [domain, setDomain] = useState("");
  const [expiryTime, setExpiryTime] = useState("");
  const [openPopup, setOpenPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorCode, setErrorCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [longUrl, setLongUrl] = useState("");
  const [errorDesc, setErrorDesc] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const backendApiDomain = process.env.REACT_APP_BACKEND_BASE_URL;

  // API Key Encryption
  const encryptApiKey = (apiKey) => {
    const passphrase = CryptoJS.enc.Utf8.parse(
      process.env.REACT_APP_PASSPHRASE
    );
    const iv = CryptoJS.enc.Utf8.parse(process.env.REACT_APP_PASSPHRASE);
    const encrypted = CryptoJS.AES.encrypt(apiKey, passphrase, {
      iv: iv,
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC,
    });
    return encrypted.toString();
  };

  const checkAndClearSessionStorage = () => {
    const limit = 5000;
    let total = 0;

    for (let key in sessionStorage) {
      if (sessionStorage.hasOwnProperty(key)) {
        total += sessionStorage[key].length;
      }
    }

    if (total > limit) {
      sessionStorage.clear();
      console.log("Session storage cleared.");
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setErrorCode("");
    setErrorMessage("");
    setErrorDesc("");
    setShortenLink("");
    setLongUrl(data.longurl);

    const longUrlKey = `shortened-${data.longurl}`;
    const storedData = sessionStorage.getItem(longUrlKey);

    if (storedData) {
      const { shortUrl, expiry, timestamp } = JSON.parse(storedData);
      const now = new Date().getTime();
      const sevenDaysInMillis = 7 * 24 * 60 * 60 * 1000;

      if (now - timestamp < sevenDaysInMillis) {
        setShortenLink(shortUrl);
        setExpiryTime(expiry);
        setLoading(false);
        reset({ longurl: "" });
        return;
      } else {
        sessionStorage.removeItem(longUrlKey);
      }
    }

    checkAndClearSessionStorage();

    if (!backendApiDomain) {
      setErrorCode(503);
      setErrorMessage("Service Unavailable, Please try again later...");
      setOpenPopup(true);
      setLoading(false);
      return;
    }

    const encryptedApiKey = encryptApiKey(process.env.REACT_APP_API_KEY);

    let normalizedUrl = data.longurl.replace(/^https:\/\//i, "https://");

    let hasTimedOut = false;
    let responsePromise;

    try {
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => {
          hasTimedOut = true;
          reject(new Error("Timeout"));
        }, 7000)
      );

      responsePromise = fetch(`${backendApiDomain}/url`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          API_KEY: encryptedApiKey,
        },
        body: JSON.stringify({ longUrl: normalizedUrl }),
      });

      const response = await Promise.race([responsePromise, timeoutPromise]);

      if (!hasTimedOut) {
        if (response.ok) {
          const result = await response.json();
          setDomain(result.domain);
          setShortenLink(result.shortUrl);
          setExpiryTime(result.expiry);

          sessionStorage.setItem(
            longUrlKey,
            JSON.stringify({
              shortUrl: result.shortUrl,
              expiry: result.expiry,
              timestamp: new Date().getTime(),
            })
          );
          reset({ longurl: "" });
        } else {
          const error = await response.json();
          setErrorMessage(error.message || "An error occurred");
          setErrorCode(error.httpCode);
          setErrorDesc(error.description);
          setOpenPopup(true);
        }
      } else {
        try {
          const lateResponse = await responsePromise;
          if (lateResponse.ok) {
            const result = await lateResponse.json();
            sessionStorage.setItem(
              longUrlKey,
              JSON.stringify({
                shortUrl: result.shortUrl,
                expiry: result.expiry,
                timestamp: new Date().getTime(),
              })
            );

            setDomain(result.domain);
            setShortenLink(result.shortUrl);
            setExpiryTime(result.expiry);
          } else {
            const error = await lateResponse.json();
            console.log("Late response error:", error);
          }
        } catch (error) {
          console.error("Error handling late response:", error);
        }
      }
    } catch (error) {
      if (error.message === "Timeout") {
        setErrorCode(408);
        setErrorMessage(
          "The request is taking longer than expected. Please try again later..."
        );
      } else {
        setErrorMessage(error.message || "An error occurred");
      }
      setOpenPopup(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-main" data-testid="url-container">
      <div className="form-container">
        <form className="innerFormContainer" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label htmlFor="long-url" className="input-lable">
              <FaLink className="link-icon" />
              Shorten a Long URL with us..
            </label>
            <TextField
              {...register("longurl")}
              className="inputField"
              placeholder="Enter Long URL here"
              id="longUrl"
              variant="filled"
              name="longurl"
              fullWidth
              autoComplete="off"
              sx={{
                backgroundColor: "#d9d9d9",
                input: { color: "#000" },
                "& .MuiFilledInput-underline:before": {
                  borderBottomColor: "#939185",
                },
                "& .MuiFilledInput-underline:hover:before": {
                  borderBottomColor: "#939185",
                },
                "& .MuiFilledInput-underline:after": {
                  borderBottomColor: "#939185",
                },
              }}
            />
            {errors.longurl && (
              <FormHelperText error sx={{ color: "red" }}>
                {errors.longurl.message}
              </FormHelperText>
            )}
          </div>
          <div className="submit-Btn">
            <button type="submit" disabled={!isValid || loading}>
              {loading ? "Loading..." : "Get Short URL"}
            </button>
          </div>
        </form>
        {loading && (
          <div className="loading-container">
            <CircularProgress />
          </div>
        )}
        {shortenLink && (
          <LinkResult
            shortenLink={shortenLink}
            expiryTime={expiryTime}
            longUrl={longUrl}
            domain={domain}
          />
        )}
      </div>
      <Popup
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
        errorMessage={errorMessage}
        errorDesc={errorDesc}
        errorCode={errorCode}
        closePopup={() => setOpenPopup(false)}
        resetForm={() => reset({ longurl: "" })}
      >
        {errorMessage}
      </Popup>
    </div>
  );
};
export default UrlContainer;
