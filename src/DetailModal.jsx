import React, { useState, useEffect } from "react";
import axios from "axios";
import { ModalHeader } from "reactstrap";

const DetailModal = ({ item }) => {
  const [checkFromMarket, setCheckFromMarket] = useState(false);
  const [linkParas, setlLinkParas] = useState(false);
  const [priceParas, setlPriceParas] = useState(false);

  function format(data) {
    return Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(data / 1e24);
  }

  useEffect(() => {
    // console.log(item);
    var tokenId = item.token_series_id.toString();
    setlLinkParas(tokenId);
    axios
      .get(
        "https://api-v2-mainnet.paras.id/token/" +
          item.contract_id +
          "::" +
          tokenId +
          ""
      )
      .then((res) => {
        // console.log(res.data.lowest_price);
        if (
          res.data.lowest_price !== null &&
          res.data.lowest_price !== undefined
        ) {
          setCheckFromMarket(true);
          var price = res.data.lowest_price.$numberDecimal;
          var setPrice = Intl.NumberFormat("de-DE", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(price);
          var priceFixed = parseFloat(setPrice).toFixed(5);
          setlPriceParas(format(price));
        }
      })
      .catch((err) => {
        // console.log(err);
      });
  }, []);

  return (
    <div>
      <div className="row">
        <div className="col" style={{ alignSelf: "center" }}>
          <img src={item.metadata.media} width="100%" alt="" />
        </div>
        <div className="col scroller-modal">
          <h3
            class="modal-title pb-4 text-white text-center"
            style={{ padding: "0 1rem" }}
          >
            {item.metadata.title == null
              ? item.metadata.name
              : item.metadata.title}{" "}
            | Rank: {item.rank}
          </h3>
          <div className="row" style={{ justifyContent: "center" }}>
            {item.metadata.attributes.map((attrData, i) => (
              <>
                <div
                  key={i}
                  className="card col-sm-5 m-1 card-trait-handle justify-center"
                  style={{ background: "#182830 !important" }}
                >
                  <span className="text-trait">
                    <b>{attrData.trait_type}</b>
                  </span>
                  <span className="text-trait">{attrData.value}</span>
                  <span className="text-trait">{attrData.rarity_score}</span>
                </div>
              </>
            ))}
          </div>
          {/* <div className="card col-sm-5 m-1 card-trait-handle justify-center">
              <span className="text-trait">
                <b>Accessories</b>
              </span>
              <span className="text-trait">
                {item.score_distribution.Accessories.item}
              </span>
              <span className="text-trait">
                {item.score_distribution.Accessories.percentage}
              </span>
            </div>
            <div className="card col-sm-5 m-1 card-trait-handle justify-center">
              <span className="text-trait">
                <b>Skin</b>
              </span>
              <span className="text-trait">
                {item.score_distribution.Skin.item}
              </span>
              <span className="text-trait">
                {item.score_distribution.Skin.percentage}
              </span>
            </div>
            <div className="card col-sm-5 m-1 card-trait-handle justify-center">
              <span className="text-trait">
                <b>Teeth</b>
              </span>
              <span className="text-trait">
                {item.score_distribution.Teeth.item}
              </span>
              <span className="text-trait">
                {item.score_distribution.Teeth.percentage}
              </span>
            </div>
            <div className="card col-sm-5 m-1 card-trait-handle justify-center">
              <span className="text-trait">
                <b>Outfit</b>
              </span>
              <span className="text-trait">
                {item.score_distribution.Outfit.item}
              </span>
              <span className="text-trait">
                {item.score_distribution.Outfit.percentage}
              </span>
            </div>
            <div className="card col-sm-5 m-1 card-trait-handle justify-center">
              <span className="text-trait">
                <b>Necklace</b>
              </span>
              <span className="text-trait">
                {item.score_distribution.Necklace.item}
              </span>
              <span className="text-trait">
                {item.score_distribution.Necklace.item}
              </span>
            </div> */}
          {!checkFromMarket ? (
            <div className="text-center text-white nfs-card">
              <h4 style={{ margin: "0" }}>NOT FOR SALE</h4>
            </div>
          ) : (
            <div className="text-center">
              <a
                href={
                  "https://paras.id/token/" +
                  item.contract_id +
                  "::" +
                  linkParas +
                  "/" +
                  linkParas
                }
                target="_blank"
                style={{ textDecoration: "none" }}
              >
                <div className="sale-card">
                  <h4 style={{ margin: "0" }}>BUY {priceParas} Ⓝ</h4>
                </div>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailModal;
