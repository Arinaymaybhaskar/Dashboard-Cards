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
            <div className="filter-container">
              <label>
                Type
                <br />
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
                <br />
              </label>
              <label>
                Cardholder:
                <select
                  value={cardholderFilter}
                  onChange={handleCardholderFilter}
                >
                  <option value="">Select Cardholder</option>
                  <option value="Cardholder 1">Cardholder 1</option>
                  <option value="Cardholder 2">Cardholder 2</option>
                </select>
              </label>
              <br />
              <div className="flex w-full justify-evenly">
                <button onClick={() => close()}>Apply</button>
                <button onClick={handleClearFilters}>Clear</button>
              </div>
            </div>
          )}
        </Popup>
      </div>

      <div className="card-container flex flex-wrap gap-10 m-8">
        {filteredData.map((item) => (
          <div
            className="border-[1px] p-6 rounded-lg shadow-lg w-72"
            key={item.name}
          >
            <div className="flex justify-between">
              <div>
                <p className="font-bold text-2xl">{item.name}</p>
                <p>
                  Memberfive <span className="">.</span> Budget
                </p>
              </div>
              image
            </div>
            <div className="flex justify-around">
              <div className="flex flex-col"> <p>
                
                Amount 
                </p>
                <p>
                  100 SGD
                </p>
                </div>
              <p> Frequency </p>
              <p>Expiry: {item.expiry}</p>
            </div>

            <p>
              Spent: {item.spent.value} {item.spent.currency}
            </p>
            <p>
              Available to Spend: {item.available_to_spend.value}{" "}
              {item.available_to_spend.currency}
            </p>
            <p>Card Type: {item.card_type}</p>
            <p>Limit: {item.limit}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardComponent;
