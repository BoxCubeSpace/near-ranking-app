import { useState, useEffect } from "react";
import axios from "axios";
import { db, storage } from "../../resources/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";
import emailjs from "emailjs-com";

export default function Req() {
  const [contractAvailable, setContractAvailable] = useState(false);
  const [validation, setValidation] = useState(false);
  const [loadValidation, setLoadValidation] = useState(false);
  const [emptyForm, setEmptyForm] = useState(false);
  const [firstPage, setFirstPage] = useState(false);
  const [emailAddress, setEmailAddress] = useState("");
  const [contract, setContract] = useState("");
  const [collectionName, setCollectionName] = useState("");
  const [collectionDesc, setCollectionDesc] = useState("");
  const [twitter, setTwitter] = useState("");
  const [website, setWebsite] = useState("");
  const [discord, setDiscord] = useState("");
  const [username, setUsername] = useState("");
  const [contact, setContact] = useState("");
  const [imageProfile, setImageProfile] = useState(null);
  const [imageBanner, setImageBanner] = useState(null);

  const contractExist = () => {
    axios
      .get(
        "https://api-v2-mainnet.paras.id/collections?collection_id=" + contract
      )
      .then((res) => {
        // console.log(res.data.data.results[0]);
        if (
          res.data.data.results[0] !== undefined &&
          res.data.data.results[0] !== null
        ) {
          setContractAvailable(true);
        } else {
          setContractAvailable(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const templateParams1 = {
    name: collectionName,
    twitter: twitter,
    contact: contact,
    to_email: process.env.REACT_APP_MAIL_ONE,
  };
  const templateParams6 = {
    name: collectionName,
    twitter: twitter,
    contact: contact,
    to_email: process.env.REACT_APP_MAIL_SIX,
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault(); // Prevents default refresh by the browser
    await emailjs
      .send(
        process.env.REACT_APP_SERVICE_TWO,
        process.env.REACT_APP_TEMP_RANKING,
        templateParams1,
        process.env.REACT_APP_PUBKEY_TWO
      )
      .then(
        (response: any) => {
          console.log("SUCCESS!", response.status, response.text);
        },
        (err: any) => {
          console.log("FAILED...", err);
        }
      );
    await emailjs
      .send(
        process.env.REACT_APP_SERVICE_TWO,
        process.env.REACT_APP_TEMP_RANKING,
        templateParams6,
        process.env.REACT_APP_PUBKEY_TWO
      )
      .then(
        (response: any) => {
          console.log("SUCCESS!", response.status, response.text);
        },
        (err: any) => {
          console.log("FAILED...", err);
        }
      );
  };

  const submitRequest = async (e: any) => {
    if (
      collectionName == "" ||
      collectionDesc == "" ||
      twitter == "" ||
      website == "" ||
      discord == "" ||
      username == "" ||
      contact == "" ||
      contract == "" ||
      imageProfile == null ||
      imageBanner == null
    ) {
      setValidation(false);
      setEmptyForm(true);
    } else {
      setLoadValidation(true);
      setEmptyForm(false);
      const imageRefProfile = ref(
        storage,
        `launchapp/generalRank/profile/${imageProfile.name + v4()}`
      );
      const imageRefBanner = ref(
        storage,
        `launchapp/generalRank/banner/${imageBanner.name + v4()}`
      );
      const colRefget = doc(db, "rankingRequest", contract);
      // const recordget = await getDoc(colRefget);

      await uploadBytes(imageRefProfile, imageProfile).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((urlProfile) => {
          uploadBytes(imageRefBanner, imageBanner).then((snapshot2) => {
            getDownloadURL(snapshot2.ref).then(async (urlBanner) => {
              await setDoc(colRefget, {
                contractId: contract,
                collectionId: contract,
                collectionName: collectionName,
                description: collectionDesc,
                twitter: twitter,
                website: website,
                discord: discord,
                emailAddress: emailAddress,
                requester: username,
                contactRequester: contact,
                profilePicture: urlProfile,
                bannerPicture: urlBanner,
                isActive: false,
                createdAt: new Date().toUTCString(),
              });
              setLoadValidation(false);
              setValidation(true);
              handleSubmit(e);
            });
          });
        });
      });
      // console.log("create success");
      // setInterval(() => {
      //   window.location.reload();
      // }, 3000);
    }
  };

  useEffect(() => {
    (async () => {
      // console.log(contract);
    })();
  }, [contract, contractExist, submitRequest]);

  return (
    <>
      <div className="container text-white text-center mt-4 p-4">
        <h1>Apply For Ranking</h1>
        <a className="backward" href="/">
          <img
            src="https://firebasestorage.googleapis.com/v0/b/boxcube-33f6d.appspot.com/o/launchapp%2Fback-forward.png?alt=media&token=991a60ec-8c34-448a-a4a1-35a7276b67eb"
            width="20%"
            style={{ background: "transparent" }}
            alt=""
          />
        </a>
      </div>
      <div className="container text-white">
        <form>
          <div className="form-group">
            {contractAvailable ? (
              <small
                id="emailHelp"
                className="form-text"
                style={{ color: "green" }}
              >
                Your contract available!
              </small>
            ) : (
              <small
                id="emailHelp"
                className="form-text"
                style={{ color: "red" }}
              >
                Contract not detected!
              </small>
            )}
            <br />
            <label htmlFor="exampleInputEmail1">Your contract</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Contract"
              onChange={(e) => {
                setContract(e.target.value);
              }}
            />
            <br />
            <button
              type="button"
              onClick={contractExist}
              className="req-button mt-2"
              style={{ margin: "0" }}
            >
              Check
            </button>
            <br />
            <br />
            <label htmlFor="exampleInputEmail1">Collection Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Collection Name"
              onChange={(e) => {
                setCollectionName(e.target.value);
              }}
            />
            <br />
            <label htmlFor="formFile" className="form-label">
              Collection Profile Picture
            </label>
            <input
              className="form-control"
              type="file"
              id="formFile"
              accept="image/*"
              onChange={(e) => {
                setImageProfile(e.target.files[0]);
              }}
            />
            <br />
            <label htmlFor="formFile" className="form-label">
              Collection Banner Picture
            </label>
            <input
              className="form-control"
              type="file"
              id="formFile"
              accept="image/*"
              onChange={(e) => {
                setImageBanner(e.target.files[0]);
              }}
            />
            <small className="form-text text-white">
              Example size 1200 x 400
            </small>
            <br />
            <br />
            <label htmlFor="exampleInputEmail1">Collection Description</label>
            <br />
            <textarea
              className="form-control"
              id="exampleFormControlTextarea1"
              onChange={(e) => {
                setCollectionDesc(e.target.value);
              }}
            ></textarea>
            <br />
            <label htmlFor="exampleInputEmail1">Twitter Project</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Collection Twitter"
              onChange={(e) => {
                setTwitter(e.target.value);
              }}
            />
            <br />
            <label htmlFor="exampleInputEmail1">Website Project</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Website Project"
              onChange={(e) => {
                setWebsite(e.target.value);
              }}
            />
            <br />
            <label htmlFor="exampleInputEmail1">Discord Project Server</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Discord Project Server"
              onChange={(e) => {
                setDiscord(e.target.value);
              }}
            />
            <br />
            <label htmlFor="exampleInputEmail1">Your Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Your Name"
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />
            <br />
            <label htmlFor="exampleInputEmail1">Your Email Address</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Your Email Address"
              onChange={(e) => {
                setEmailAddress(e.target.value);
              }}
            />
            <br />
            <label htmlFor="exampleInputEmail1">Contact</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Your Discord ID or Personal Twitter"
              onChange={(e) => {
                setContact(e.target.value);
              }}
            />
            <small className="form-text text-white"></small>
            <br />
            {emptyForm ? (
              <div
                className="alert alert-danger d-flex align-items-center"
                role="alert"
              >
                <div>
                  <strong>Do not left empty form !</strong>
                </div>
              </div>
            ) : (
              ""
            )}
            {loadValidation ? (
              <div className="text-center">
                <div className="spinner-border text-light" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              ""
            )}
            {validation ? (
              <div
                className="alert alert-success d-flex align-items-center"
                role="alert"
              >
                <div>
                  <strong>Your request successfully added !</strong>
                </div>
              </div>
            ) : (
              ""
            )}
            <div className="text-center mb-4">
              <button
                type="button"
                onClick={submitRequest}
                className="req-button mt-2"
                style={{ margin: "0" }}
              >
                Submit Request
              </button>
            </div>
            <br />
            <br />
          </div>
        </form>
      </div>
    </>
  );
}
