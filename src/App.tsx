import "./App.css";
import React, { useState, useEffect } from "react";
import { dataRanking } from "./data-ranking";
import List from "./List";
import { IconSearch } from "@tabler/icons";
// import Modal from "./Modal";
// import { Image, Text ,View, ScrollView } from 'react-native';
import { ScrollView, View } from "react-native";
import Collapsible from "react-collapsible";
import { IconBrandTwitter, IconLink, IconBrandDiscord } from "@tabler/icons";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./resources/firebaseConfig";
import { useParams } from "react-router-dom";

import axios from "axios";
const _ = require("lodash");

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.tsx</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

function App() {
  const { colId } = useParams();
  const [text, setText] = React.useState("waiting...");
  const [collectionPic, setCollectionPic] = useState("");
  const [collectionName, setCollectionName] = useState("");
  const [collectionContract, setCollectionContract] = useState("");
  const [collectionDesc, setCollectionDesc] = useState("");
  const [banner, setBanner] = useState("");
  const [profile, setProfile] = useState("");
  const [twitter, setTwitter] = useState("");
  const [discord, setDiscord] = useState("");
  const [website, setWebsite] = useState("");
  const [floorPrice, setFloorPrice] = useState("");
  const [volumeNear, setVolumeNear] = useState("");
  const [items, setitems] = useState("");
  const [count, setCount] = useState(20);
  const scrollViewRef = React.useRef();
  const [pos, setPos] = React.useState(0);
  const isCancelled = React.useRef(false);
  const [selectedBackground, setSelectedBackground] = useState(Array);
  const [backgroundCount, setSelectedBackgroundCount] = useState(Array);
  const [selectedAccessories, setSelectedAccessories] = useState(Array);
  const [selectedSkin, setSelectedSkin] = useState(Array);
  const [selectedTeeth, setSelectedTeeth] = useState(Array);
  const [selectedOutfit, setSelectedOutfit] = useState(Array);
  const [selectedNecklace, setSelectedNecklace] = useState(Array);
  const simulateSlowNetworkRequest = () =>
    new Promise((resolve) => setTimeout(resolve, 2500));
  const nftsDatas = require("./nfts_data/" + colId + ".json");
  // const attributesData: { attrName: any; datas: any[] }[] = [];
  // const [attributesDatas, setAttributesDatas] = useState([]);

  // const filtersData: { attrName: any; datas: any[] }[] = [];
  // const [filtersDatas, setFiltersDatas] = useState(filtersData);

  const [filteredNftDatas, setFilteredNftDatas] = useState([]);

  let existedData = {} as any;
  let allAttrib = [] as any;
  const [uniqueFiltersData, setUniqueFiltersData] = useState([]);

  const [query, setQuery] = useState("");
  const keys = ["name"];
  const search = (data: any) => {
    return data.filter((item: any) =>
      keys.some((key) =>
        item.metadata[key] != null
          ? item.metadata[key].toLowerCase().includes(query)
          : item.metadata["title"].toLowerCase().includes(query)
      )
    );
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

  function updateData() {
    // return format [attrName: [datas.filterName] => jadi datanya string dalam array bentuknya ]
    let newFilterFormat: { [key: string]: any } = {};
    uniqueFiltersData.forEach((val) => {
      // let newDatas = val.datas.filter((val2:any) => val2.isActiveFilter);
      let newDatas = _.filter(val.datas, function (o: any) {
        return o.isActive;
      });
      // let newDatas = val.datas.forEach
      if (newDatas.length > 0) {
        newFilterFormat[val.filterType] = newDatas.map(
          (val2: any) => val2.filterName
        );
      }
    });

    // return akhir datanya
    let filteredData: any = [];
    nftsDatas.forEach((val: any): any => {
      // return format [trait_type: value]
      let currentUsedAttribute: { [key: string]: any } = {};
      // console.log(val.metadata.attributes);
      val.metadata.attributes.forEach(
        (val2: any) => (currentUsedAttribute[val2.trait_type] = val2.value)
      );

      // check kalo filter format nya ada data dari currentUsedAttribute
      for (let key in currentUsedAttribute) {
        if (
          key in newFilterFormat &&
          !newFilterFormat[key].includes(currentUsedAttribute[key])
        ) {
          return null;
        }
      }
      filteredData.push(val);
    });

    setFilteredNftDatas(filteredData);
  }

  const handleSelectItem = (filtersIndex: any, dataIndex: any) => {
    uniqueFiltersData[filtersIndex].datas[dataIndex].isActive =
      !uniqueFiltersData[filtersIndex].datas[dataIndex].isActive;
    updateData();
  };

  useEffect(() => {}, []);

  useEffect(() => {
    updateData();
    for (let i in nftsDatas) {
      allAttrib.push(...nftsDatas[i].metadata.attributes);

      for (let i2 of nftsDatas[i].metadata.attributes) {
        if (!existedData[i2.trait_type]) {
          existedData[i2.trait_type] = [];
        }

        if (!existedData[i2.trait_type].includes(i2.value)) {
          existedData[i2.trait_type].push(i2.value);
        }
      }
    }
    fetch();

    return () => {
      isCancelled.current = true;
    };

    // console.log(uniqueFiltersData);
  }, []);

  function fetch() {
    simulateSlowNetworkRequest().then(() => {
      if (!isCancelled.current) {

        for (let i in existedData) {
          let newData = { filterType: i, datas: [] as any };
          for (let i2 of existedData[i]) {
            newData.datas.push({
              filterName: allAttrib.find(
                (val: any) => val.trait_type === i && val.value === i2
              ).value,
              isActive: false,
            });
          }

          uniqueFiltersData.push(newData);
        }
      }
    });
  }

  useEffect(() => {
    (async () => {
      // console.log(nftsDatas[0].creator_id);
      const colRefget = doc(db, "generalRank", colId);
      const recordget = await getDoc(colRefget);
      if (recordget.exists()) {
        setCollectionName(recordget.data()["collectionName"]);
        setCollectionPic(recordget.data()["profilePicture"]);
        setCollectionContract(recordget.data()["contractId"]);
        setCollectionDesc(recordget.data()["description"]);
        setTwitter(recordget.data()["twitter"]);
        setDiscord(recordget.data()["discord"]);
        setWebsite(recordget.data()["website"]);
        setBanner(recordget.data()["bannerPicture"]);
        setProfile(recordget.data()["profilePicture"]);
      }
      axios
        .get(
          "https://api-v2-mainnet.paras.id/collection-stats?collection_id=" +
            colId
        )
        .then((res) => {
          // console.log(res.data.data.results.floor_price);
          let fp = res.data.data.results.floor_price;
          var fpSet = Intl.NumberFormat("de-DE", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(fp);
          var fpFix = parseFloat(fpSet).toFixed(0);
          let vn = res.data.data.results.volume;
          var vnSet = Intl.NumberFormat("de-DE", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(vn);
          var vnFix = parseFloat(vnSet).toFixed(3);
          let vu = res.data.data.results.total_cards;
          setFloorPrice(fpFix);
          setVolumeNear(vnFix.toString());
          setitems(vu);
        })
        .catch((err) => {
          // console.log(err);
        });
    })();
  }, []);

  function getTotalCount(filterName: any, filterTypeIndex: any) {
    return nftsDatas.filter((item: any) =>
      filterName.includes(item.metadata.attributes[filterTypeIndex].value)
    ).length;
  }

  return (
    <>
      <div className="container" style={{ maxWidth: "unset", padding: "0" }}>
        <div className="app">
          <a className="backward" href="/">
            <img
              src="https://firebasestorage.googleapis.com/v0/b/boxcube-33f6d.appspot.com/o/launchapp%2Fback-forward.png?alt=media&token=991a60ec-8c34-448a-a4a1-35a7276b67eb"
              width="20%"
              alt=""
            />
          </a>
          <div
            className="banner-collection"
            style={{
              backgroundImage: `url("${banner}"), linear-gradient(rgba(196, 77, 86, 0.40),rgba(196, 77, 86, 0.40))`,
              padding: "2rem 0 3rem 0",
            }}
          >
            <div className="container" style={{ position: "relative" }}>
              <div className="collection-header text-white">
                <img
                  className="img-collection"
                  src={collectionPic}
                  width="10%"
                  alt=""
                />
                <div>
                  <h2>{collectionName}</h2>
                  <h5>{collectionContract}</h5>
                  <p>{collectionDesc}</p>
                  <div className="socmed-detail-collection">
                    <a href={twitter} style={{ textDecoration: "none" }}>
                      <IconBrandTwitter
                        className="ms-2"
                        size="30"
                        color="white"
                      />
                    </a>
                    <a href={website} style={{ textDecoration: "none" }}>
                      <IconLink className="ms-2" size="30" color="white" />
                    </a>
                    <a href={discord} style={{ textDecoration: "none" }}>
                      <IconBrandDiscord
                        className="ms-2"
                        size="30"
                        color="white"
                      />
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="container">
              <div
                className="row text-center text-white"
                style={{ justifyContent: "center" }}
              >
                <div className="col-sm-4 mt-2 card-collection">
                  <h5>Floor Price</h5>
                  <span>{floorPrice}Ⓝ</span>
                </div>
                <div className="col-sm-4 mt-2 card-collection">
                  <h5>Total Vol</h5>
                  <span>{volumeNear}Ⓝ</span>
                </div>
                <div className="col-sm-4 mt-2 card-collection">
                  <h5>Items</h5>
                  <span>{items}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-sm col-lg-2 bg-filters">
              <div className="container pt-4 pb-3">
                <h1>Filters</h1>
              </div>
              <div className="container scroller-filter">
                {uniqueFiltersData.map((data: any, index: any) => (
                  <>
                    <Collapsible
                      transitionTime={400}
                      trigger={data.filterType + " (" + data.datas.length + ")"}
                      easing={"cubic-bezier(0.175, 0.885, 0.32, 2.275)"}
                      triggerStyle={{}}
                    >
                      <div className="container mt-5">
                        <div className="row">
                          {data.datas.map((item: any, i: any) => (
                            <>
                              <dl>
                                <dt>
                                  <label>
                                    <input
                                      type="checkbox"
                                      name="checkbox"
                                      id={data.filterType}
                                      value={item.filterName}
                                      checked={item.isActive}
                                      onChange={(event) =>
                                        handleSelectItem(index, i)
                                      }
                                    />{" "}
                                    {item.filterName +
                                      " (" +
                                      getTotalCount(item.filterName, index) +
                                      ")"}
                                  </label>
                                </dt>
                              </dl>
                            </>
                          ))}
                        </div>
                      </div>
                      {/* {<BackgroundFilters data={dataRanking} onClick={(e) => setQuery(e.target.value.toLowerCase())} />} */}
                    </Collapsible>
                  </>
                ))}
              </div>
            </div>
            <div className="col-sm bg-list">
              <div
                className="container mt-3 mb-4"
                style={{ position: "relative" }}
              >
                <input
                  className="search search-box"
                  placeholder="Search"
                  onChange={(e) => setQuery(e.target.value.toLowerCase())}
                />
                <IconSearch className="search-style" color="#c44d56" />
              </div>
              <View style={{ height: "90vh" }}>
                <ScrollView
                  onScroll={(e) => {
                    setPos(e.nativeEvent.contentOffset.y);
                    if (
                      isCloseToBottom(
                        e.nativeEvent.layoutMeasurement,
                        e.nativeEvent.contentOffset,
                        e.nativeEvent.contentSize
                      )
                    ) {
                      // console.log("Close To Bottom");
                      setCount(count + 10);
                    }
                  }}
                  scrollEventThrottle={550}
                >
                  {
                    <List
                      data={search(filteredNftDatas).slice(0, count)}
                      collectionName={collectionName}
                    />
                  }
                </ScrollView>
              </View>
            </div>
          </div>
        </div>
      </div>
      {
        // filteredRankingList.map((item, i) => (
        //   <Modal data={item} />
        // ))
      }
    </>
  );
}

export default App;
