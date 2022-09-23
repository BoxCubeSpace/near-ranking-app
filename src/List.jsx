import MyModal from "./Modal";
import React, { useState, useEffect } from "react";
import toggle from "./Modal";
import DetailModal from "./DetailModal";
import { Button } from "reactstrap";

const Table = ({ data, collectionName }) => {
  return (
    <>
      <div className="container scroller-card">
        <div class="row">
          {data.map((item, i) => (
            <>
              <div className="col-sm-2-5 mb-2">
                <div key={i} className="card img-circle">
                  <img
                    className="pb-2 p-3"
                    src={item.metadata.media}
                    width="100%"
                    alt=""
                  />
                  <div>
                    <h4 className="text-center" style={{ margin: "0" }}>
                      {item.metadata.title === null ? item.metadata.name : item.metadata.title}
                    </h4>
                  </div>
                  <div>
                    <h6 className="text-center card-rank card-rank-bg" style={{ margin: "0"}}>
                      Rank {item.rank}
                    </h6>
                  </div>
                  <div className="modal-cus">
                    <div className="text-center pb-2">
                      <MyModal
                        trigger={
                          <button
                            variant="primary"
                            style={{
                              width: "90%",
                              background: "#5b282c",
                              color: "white",
                              borderRadius: '0.5rem',
                              border: "none",
                              padding: "0.2rem 0",
                              marginTop: '0.5rem'
                            }}
                          >
                            Details
                          </button>
                        }
                        data={item}
                        collectionName={collectionName}
                      >
                        <DetailModal item={item}/>
                      </MyModal>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ))}
        </div>
      </div>
    </>
  );
};

export default Table;
