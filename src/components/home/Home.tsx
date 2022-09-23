import { useEffect, useState } from "react";
import "./home.css";
import Nav from "../../widgets/nav";
import { db } from "../../resources/firebaseConfig";
import { collection, onSnapshot, where, query } from "firebase/firestore";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { ScrollView, View } from "react-native";
import App from "../../App";

const Home = ({}) => {
  const [count, setCount] = useState(1);
  const [listSort, setListSort] = useState([]);
  const [chooseSort, setChooseSort] = useState(0);
  // const [collectionName, setCollectionName] = useState([]);
  // const [totalSales, setTotalSales] = useState(Array);
  // const [average, setAverage] = useState(Array);
  // const [totalOwner, setTotalOwner] = useState(Array);
  // const [totalSupply, setTotalSupply] = useState(Array);
  // const [totalVol, setTotalVol] = useState(Array);
  // const [floorPrice, setFloorPrice] = useState(Array);

  const getAPI = async (limit: any, i: any) => {
    const response = await fetch(
      "https://api-v2-mainnet.paras.id/collection-stats?collection_id=" +
        limit[i].collectionId
    );
    var json = await response.json();
    return json;
  };

  function isCloseToBottom(
    layoutMeasurement: any,
    contentOffset: any,
    contentSize: any
  ) {
    const paddingToBottom = 20;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  }

  function format(data: any) {
    return Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(data / 1e24);
  }

  async function fetchAPI(limit: any, sortDatas: any) {
    var tSales = [];
    var ave = [];
    var tOwner = [];
    var tSupply = [];
    var tVol = [];
    var tFloor = [];
    for (var i = 0; i < limit.length; i++) {
      let res = await getAPI(limit, i);
      // SET FLOOR PRICE
      var setFP = Intl.NumberFormat("de-DE", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(res.data.results.floor_price);
      var FPFixed = parseFloat(setFP).toFixed(1);
      // SET TOTAL SALES
      var setVOL = Intl.NumberFormat("de-DE", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(res.data.results.volume);
      var VOLFixed = parseFloat(setVOL).toFixed(2);
      // SET AVERAGE PRICE
      var setAP = Intl.NumberFormat("de-DE", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(res.data.results.avg_price);
      var APFixed = parseFloat(setAP).toFixed(2);
      tSales.push(res.data.results.total_sales);
      ave.push(APFixed);
      tOwner.push(res.data.results.total_owners);
      tSupply.push(res.data.results.total_cards);
      tVol.push(format(res.data.results.volume));
      tFloor.push(format(res.data.results.floor_price));
    }
    // setTotalSales(tSales);
    // setAverage(ave);
    // setTotalOwner(tOwner);
    // setTotalSupply(tSupply);
    // setTotalVol(tVol);
    // setFloorPrice(tFloor);
    for (var i = 0; i < limit.length; i++) {
      await sortDatas.push({
        database: limit[i],
        totalVolume: tVol[i],
        totalSales: tSales[i],
        average: ave[i],
        totalOwner: tOwner[i],
        totalSupply: tSupply[i],
        floorPrice: tFloor[i],
      });
    }
    if (chooseSort === 0) {
      const floorSort = sortDatas.sort(
        (a: any, b: any) => b.floorPrice.valueOf() - a.floorPrice.valueOf()
      );
      setListSort(floorSort);
    } else if (chooseSort === 1) {
      const latestSort = sortDatas.sort(
        (a: any, b: any) =>
          b.database.createdAt.valueOf() - a.database.createdAt.valueOf()
      );
      setListSort(latestSort);
    } else  if (chooseSort === 2) {
      const volSort = sortDatas.sort(
        (a: any, b: any) => Number(b.totalVolume.valueOf().replace(/(^\$|,)/g,'')) - Number(a.totalVolume.valueOf().replace(/(^\$|,)/g,''))
      );
      setListSort(volSort);
    }
  }

  useEffect(() => {
    let sortDatas: { collectionName: any; totalVolume: any }[] = [];
    const getAllCollectionName = onSnapshot(
      query(collection(db, "generalRank"), where("isActive", "==", true)),
      (querySnapshot: any) => {
        const documents = querySnapshot.docs.map((doc: any) => {
          return {
            ...doc.data(),
            id: doc.id,
          };
        });
        // setCollectionName(documents);
        fetchAPI(documents, sortDatas);
        // for (var i = 0; i < documents.length; i++) {
        //   var dataCollectionName = documents[i].collectionName;
        //   // // console.log(dataCollectionName);
        // }
      }
    );
    return () => getAllCollectionName();
  }, [chooseSort]);

  return (
    <>
      <Nav />
      <section className="home-section">
        <div className="container text-white head-distance">
          <h1>The future of NFT Rarity platforms on NEAR Protocol.</h1>
          <p>
            One app to view your NFT portfolio value, rankings, scores, and
            sweet artwork in high resolution. Accessible anywhere.
          </p>
        </div>
        <div className="row">
          <div className="col-5"></div>
          <div className="col-5"></div>
        </div>
        <div className="container">
          <div
            className="btn-group text-center header-list pb-4"
            role="group"
            aria-label="Basic radio toggle button group"
          >
            <input
              type="radio"
              className="btn-check"
              name="btnradio"
              id="btnradio1"
              autoComplete="off"
              onClick={(e) => setChooseSort(0)}
              checked={chooseSort === 0 ? true : false}
            />
            <label className="btn btn-outline-danger" htmlFor="btnradio1">
              Top Floor Price
            </label>

            <input
              type="radio"
              className="btn-check"
              name="btnradio"
              id="btnradio3"
              autoComplete="off"
              onClick={(e) => setChooseSort(2)}
              checked={chooseSort === 2 ? true : false}
            />
            <label className="btn btn-outline-danger" htmlFor="btnradio3">
              Total Volume
            </label>
            
            <input
              type="radio"
              className="btn-check"
              name="btnradio"
              id="btnradio2"
              autoComplete="off"
              onClick={(e) => setChooseSort(1)}
              checked={chooseSort === 1 ? true : false}
            />
            <label className="btn btn-outline-danger" htmlFor="btnradio2">
              Latest Post
            </label>
          </div>
          <div className="row" style={{ color: "#c44d56" }}>
            <div className="spacer" />
            <div className="col-1-num">No</div>
            <div className="col-3-custom">Collection</div>
            <div className="col-1-custom">Floor Price</div>
            <div className="col-1-custom">Total Volume</div>
            <div className="col-1 deactive">Total Supply</div>
            <div className="col-1 deactive">Total Owners</div>
            <div className="col-1 deactive">Average</div>
            <div className="col-1 deactive">On Sale</div>
          </div>
          <hr className="hr-custom" />
          <View style={{ height: "65vh" }}>
            <ScrollView
              onScroll={(e) => {
                if (
                  isCloseToBottom(
                    e.nativeEvent.layoutMeasurement,
                    e.nativeEvent.contentOffset,
                    e.nativeEvent.contentSize
                  )
                ) {
                  // console.log("Close To Bottom");
                  setCount(count + 8);
                }
              }}
              scrollEventThrottle={150}
            >
              <div className="pb-5 scrolled-collection">
                {listSort.map((item, i) => (
                  <Link
                    style={{ textDecoration: "none" }}
                    to={`/detail/${item.database.collectionId}`}
                  >
                    <div
                      className="row list-collection text-white"
                      style={{ alignItems: "center" }}
                    >
                      <div className="spacer" />
                      <div className="col-1-num">{i + 1}</div>
                      <div className="col-1-img">
                        <img
                          className="img-list-collection"
                          src={item.database.profilePicture}
                          alt=""
                        />
                      </div>
                      <div className="col-3-custom-v">
                        {item.database.collectionName}
                      </div>
                      <div className="col-1-custom">{item.floorPrice}Ⓝ</div>
                      <div className="col-1-custom">{item.totalVolume}Ⓝ</div>
                      <div className="col-1 deactive">{item.totalSupply}</div>
                      <div className="col-1 deactive">{item.totalOwner}</div>
                      <div className="col-1 deactive">{item.average}Ⓝ</div>
                      <div className="col-1 deactive">{item.totalSales}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </ScrollView>
          </View>
          <br />
          <br />
        </div>
      </section>
    </>
  );
};

export default Home;
