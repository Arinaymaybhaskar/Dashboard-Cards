import React, { useState, useEffect, useRef } from "react";
import jsonData from "./data.json";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";

const CardComponent = () => {
  const data = jsonData.data;
  const [searchTerm, setSearchTerm] = useState("");
  const [cardTypeFilter, setCardTypeFilter] = useState("");
  const [cardholderFilter, setCardholderFilter] = useState("");
  const [activeTab, setActiveTab] = useState("Your");
  const [loadedData, setLoadedData] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const handleIconClick = () => {
    setIsSearchVisible(true);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleCardTypeFilter = (event) => {
    setCardTypeFilter(event.target.value);
  };

  const handleCardholderFilter = (event) => {
    setCardholderFilter(event.target.value);
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setCardTypeFilter("");
    setCardholderFilter("");
  };

  const fetchData = () => {
    // Simulating API call delay
    setIsLoading(true);
    setTimeout(() => {
      // Adjust the logic based on your actual API data fetching
      const start = (page - 1) * 10;
      const end = start + 10;
      const newData = jsonData.data.slice(start, end);
      setLoadedData((prevData) => [...prevData, ...newData]);
      setIsLoading(false);
    }, 1000);
  };

  useEffect(() => {
    if (page > 1) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const scrollTriggerRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((prevPage) => prevPage + 1);
        }
      },
      { threshold: 1 }
    );

    if (scrollTriggerRef.current) {
      observer.observe(scrollTriggerRef.current);
    }

    return () => {
      if (scrollTriggerRef.current) {
        observer.unobserve(scrollTriggerRef.current);
      }
    };
  }, []); // Empty dependency array to run only once

  const filteredData = data.filter((item) => {
    const matchesSearchTerm = item.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCardType =
      cardTypeFilter === "" || item.card_type === cardTypeFilter;
    const matchesCardholder =
      cardholderFilter === "" || item.owner_id === cardholderFilter;

    if (activeTab === "Your") {
      return matchesSearchTerm && matchesCardType && matchesCardholder;
    } else if (activeTab === "All") {
      return matchesSearchTerm && matchesCardType;
    } else if (activeTab === "Blocked") {
      return matchesSearchTerm && matchesCardType && item.status === "Blocked";
    }

    return false;
  });

  const yourCards = filteredData.filter(
    (item) => item.owner_id === "your_owner_id"
  );

  return (
    <div>
      <nav className="navbar">
        <ul className="flex h-10 justify-start m-3 px-9 font-medium items-center w-full gap-5 border-b-[2px] border-neutral-200">
          <li
            className={activeTab === "Your" ? "active" : ""}
            onClick={() => handleTabClick("Your")}
          >
            <button>Your</button>
          </li>
          <li
            className={activeTab === "All" ? "active" : ""}
            onClick={() => handleTabClick("All")}
          >
            <button>All</button>
          </li>
          <li
            className={activeTab === "Blocked" ? "active" : ""}
            onClick={() => handleTabClick("Blocked")}
          >
            <button>Blocked</button>
          </li>
        </ul>
      </nav>
      <div className="flex w-full justify-end">
        <div className="search-container">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9 16a7 7 0 100-14A7 7 0 009 16zm7.707-1.293l-3-3a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414-1.414zM9 14a5 5 0 110-10 5 5 0 010 10z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            {isSearchVisible ? (
              <input
                type="text"
                placeholder="Search by item name"
                value={searchTerm}
                onChange={handleSearch}
                className="pl-10 pr-3 py-2 w-40 rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
              />
            ) : null}
            {!isSearchVisible && (
              <button
                className="pl-3 pr-3 py-2 rounded-md bg-transparent hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                onClick={handleIconClick}
              >
                <svg
                  className="h-5 w-5 text-gray-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M9 16a7 7 0 100-14A7 7 0 009 16zm7.707-1.293l-3-3a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414-1.414zM9 14a5 5 0 110-10 5 5 0 010 10z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
        <Popup
          trigger={
            <button className="flex bg-neutral-300 p-2 items-center justify-center rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="25"
                viewBox="0 -960 960 960"
                width="48"
              >
                <path d="M400-240v-60h160v60H400ZM240-450v-60h480v60H240ZM120-660v-60h720v60H120Z" />
              </svg>
              <p className="font-medium">Filter</p>
            </button>
          }
          modal
          nested
          position="center center"
        >
          {(close) => (
            <div className=" p-5 py-3 w-auto h-auto flex flex-col ">
              <p className="font-semibold w-full border-b-[1px] mb-3 border-b-neutral-200 ">
                Filters
              </p>
              <label className="font-semibold flex flex-col">
                <p className="text-neutral-500 mb-3">Type</p>
                <div className="flex gap-14 border-b-[1px] pb-4 border-b-neutral-200">
                  <label>
                    <input
                      type="checkbox"
                      value="subscription"
                      checked={cardTypeFilter.includes("subscription")}
                      onChange={handleCardTypeFilter}
                    />{" "}
                    Subscription
                  </label>
                  <br />
                  <label>
                    <input
                      type="checkbox"
                      value="burner"
                      checked={cardTypeFilter.includes("burner")}
                      onChange={handleCardTypeFilter}
                    />{" "}
                    Burner
                  </label>
                </div>
                <br />
              </label>
              <label className="flex flex-col">
                Cardholder:
                <select
                  className="bg-neutral-200 p-4 text-neutral-500 font-semibold mt-2"
                  value={cardholderFilter}
                  onChange={handleCardholderFilter}
                >
                  <option value="">Select Cardholder</option>
                  <option value="Cardholder 1">Cardholder 1</option>
                  <option value="Cardholder 2">Cardholder 2</option>
                </select>
              </label>
              <br />
              <div className="flex w-full justify-evenly gap-4">
                <button
                  className="w-1/2 bg-[#d10448] p-2 rounded-xl text-white font-semibold"
                  onClick={() => close()}
                >
                  Apply
                </button>
                <button
                  className="w-1/2 bg-neutral-200 p-2 rounded-xl text-neutral-600 font-semibold"
                  onClick={handleClearFilters}
                >
                  Clear
                </button>
              </div>
            </div>
          )}
        </Popup>
      </div>

      <div className="card-container flex flex-wrap gap-10 m-8">
        {filteredData.map((item) => (
          <div
            className="border-[1px] p-6 rounded-lg shadow-lg w-96"
            key={item.name}
          >
            <div className="flex justify-between">
              <div>
                <p className="font-bold text-2xl">{item.name}</p>
                <p>
                  <p className="text-neutral-500">Limit: {item.limit}</p>
                </p>
              </div>
              {item.card_type === "burner" && (
                <svg
                  fill="#000000"
                  width="40px"
                  height="40px"
                  viewBox="0 0 16 16"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M9.32 15.653a.812.812 0 0 1-.086-.855c.176-.342.245-.733.2-1.118a2.106 2.106 0 0 0-.267-.779 2.027 2.027 0 0 0-.541-.606 3.96 3.96 0 0 1-1.481-2.282c-1.708 2.239-1.053 3.51-.235 4.63a.748.748 0 0 1-.014.901.87.87 0 0 1-.394.283.838.838 0 0 1-.478.023c-1.105-.27-2.145-.784-2.85-1.603a4.686 4.686 0 0 1-.906-1.555 4.811 4.811 0 0 1-.263-1.797s-.133-2.463 2.837-4.876c0 0 3.51-2.978 2.292-5.18a.621.621 0 0 1 .112-.653.558.558 0 0 1 .623-.147l.146.058a7.63 7.63 0 0 1 2.96 3.5c.58 1.413.576 3.06.184 4.527.325-.292.596-.641.801-1.033l.029-.064c.198-.477.821-.325 1.055-.013.086.137 2.292 3.343 1.107 6.048a5.516 5.516 0 0 1-1.84 2.027 6.127 6.127 0 0 1-2.138.893.834.834 0 0 1-.472-.038.867.867 0 0 1-.381-.29zM7.554 7.892a.422.422 0 0 1 .55.146c.04.059.066.126.075.198l.045.349c.02.511.014 1.045.213 1.536.206.504.526.95.932 1.298a3.06 3.06 0 0 1 1.16 1.422c.22.564.25 1.19.084 1.773a4.123 4.123 0 0 0 1.39-.757l.103-.084c.336-.277.613-.623.813-1.017.201-.393.322-.825.354-1.269.065-1.025-.284-2.054-.827-2.972-.248.36-.59.639-.985.804-.247.105-.509.17-.776.19a.792.792 0 0 1-.439-.1.832.832 0 0 1-.321-.328.825.825 0 0 1-.035-.729c.412-.972.54-2.05.365-3.097a5.874 5.874 0 0 0-1.642-3.16c-.156 2.205-2.417 4.258-2.881 4.7a3.537 3.537 0 0 1-.224.194c-2.426 1.965-2.26 3.755-2.26 3.834a3.678 3.678 0 0 0 .459 2.043c.365.645.89 1.177 1.52 1.54C4.5 12.808 4.5 10.89 7.183 8.14l.372-.25z" />
                </svg>
              )}
              {item.card_type === "subscription" && <svg fill="#000000" width="40px" height="40px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M1,12A11,11,0,0,1,17.882,2.7l1.411-1.41A1,1,0,0,1,21,2V6a1,1,0,0,1-1,1H16a1,1,0,0,1-.707-1.707l1.128-1.128A8.994,8.994,0,0,0,3,12a1,1,0,0,1-2,0Zm21-1a1,1,0,0,0-1,1,9.01,9.01,0,0,1-9,9,8.9,8.9,0,0,1-4.42-1.166l1.127-1.127A1,1,0,0,0,8,17H4a1,1,0,0,0-1,1v4a1,1,0,0,0,.617.924A.987.987,0,0,0,4,23a1,1,0,0,0,.707-.293L6.118,21.3A10.891,10.891,0,0,0,12,23,11.013,11.013,0,0,0,23,12,1,1,0,0,0,22,11Z"/></svg>}
            </div>
            <div className="flex justify-around my-2 ">
              <div className="flex flex-col">
                {" "}
                <p className="text-neutral-500">Amount</p>
                <p>100 SGD</p>
              </div>
              <div className="flex flex-col">
                {" "}
                <p className="text-neutral-500">Frequency</p>
                <p>100 SGD</p>
              </div>
              <div className="flex flex-col">
                {" "}
                <p className="text-neutral-500">Expiry</p>
                <p>{item.expiry}</p>
              </div>
            </div>

            <div className="w-full flex my-3">
              <div className="w-1/2 h-2 rounded-l-full bg-green-500"></div>
              <div className="w-1/2 h-2 rounded-r-full bg-[#d10448]"></div>
            </div>

            <p className="flex justify-between text-neutral-500">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500 "></div>
                Spent
              </div>
              <span className="font-semibold text-black">
                {item.spent.value} {item.spent.currency}
              </span>
            </p>
            <p className="flex justify-between text-neutral-500">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#d10448]"></div>
                Balance
              </div>
              <span className="font-semibold text-black">
                {item.available_to_spend.value}{" "}
                {item.available_to_spend.currency}
              </span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardComponent;
