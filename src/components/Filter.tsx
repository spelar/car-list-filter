import styled from "@emotion/styled";
import { useEffect, useState } from "react";
import FilterPopup from "@src/components/FilterPopup";
import { FiltersState } from "@src/pages/ListPage";

type SetFiltersFunction = (filters: FiltersState) => void;

interface FilterProps {
  setFilters: SetFiltersFunction;
}

function Filter({ setFilters }: FilterProps) {
  const savedFilters = localStorage.getItem("selectedFilters");
  const initialFilters = savedFilters
    ? JSON.parse(savedFilters)
    : { carType: [], tags: [], region: [], price: "" };
  const [activeFilter, setActiveFilter] = useState("");
  const [selectedFilters, setSelectedFilters] =
    useState<FiltersState>(initialFilters);

  useEffect(() => {
    if (activeFilter) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [activeFilter]);

  useEffect(() => {
    localStorage.setItem("selectedFilters", JSON.stringify(selectedFilters));
    setFilters(selectedFilters);
  }, [selectedFilters, setFilters]);

  useEffect(() => {
    setFilters(selectedFilters);
  }, [selectedFilters, setFilters]);

  const resetFilters = () => {
    setSelectedFilters({ carType: [], tags: [], region: [], price: "" });
  };

  const handleFilterClick = (filterName: string) => {
    setActiveFilter(filterName);
  };

  const closePopup = () => {
    setActiveFilter("");
  };

  const toggleTagFilter = (tag: string) => {
    setSelectedFilters((prevFilters) => {
      const isTagSelected = prevFilters.tags.includes(tag);
      const newTags = isTagSelected
        ? prevFilters.tags.filter((t) => t !== tag)
        : [...prevFilters.tags, tag];
      return { ...prevFilters, tags: newTags };
    });
  };

  const isCarTypeFilterActive = selectedFilters.carType.some((filter) =>
    ["경형/소형", "준중형", "중형/대형", "수입", "SUV"].includes(filter)
  );

  const isRegionFilterActive = selectedFilters.region.some((filter) =>
    [
      "서울/경기/인천",
      "제주도",
      "부산/창원",
      "대구/경북",
      "대전",
      "광주",
    ].includes(filter)
  );

  const isPriceFilterActive = selectedFilters.price !== "";

  const handleCloseClick = (
    event: React.MouseEvent<HTMLSpanElement>,
    filterType: string
  ) => {
    event.stopPropagation();
    setSelectedFilters((prevFilters) => {
      const newFilters = {
        ...prevFilters,
        [filterType]: filterType === "price" ? "" : [],
      };
      return newFilters;
    });
    setActiveFilter("");
  };

  return (
    <>
      {activeFilter && <Overlay />}
      <FilterSection>
        <button onClick={resetFilters}>초기화</button>
        <CarTypeButton
          onClick={() => handleFilterClick("carType")}
          className={isCarTypeFilterActive ? "active" : ""}
        >
          차종 분류
          {isCarTypeFilterActive && (
            <CloseButton
              onClick={(event) => handleCloseClick(event, "carType")}
            >
              X
            </CloseButton>
          )}
        </CarTypeButton>
        <CarTypeButton
          onClick={() => handleFilterClick("region")}
          className={isRegionFilterActive ? "active" : ""}
        >
          지역
          {isRegionFilterActive && (
            <CloseButton onClick={(event) => handleCloseClick(event, "region")}>
              X
            </CloseButton>
          )}
        </CarTypeButton>
        <CarTypeButton
          onClick={() => handleFilterClick("price")}
          className={isPriceFilterActive ? "active" : ""}
        >
          가격
          {isPriceFilterActive && (
            <CloseButton onClick={(event) => handleCloseClick(event, "price")}>
              X
            </CloseButton>
          )}
        </CarTypeButton>
        {["빠른대여", "신차급", "인기", "특가", "프리미엄"].map((tag) => (
          <OptionButton
            key={tag}
            className={selectedFilters.tags.includes(tag) ? "active" : ""}
            onClick={() => toggleTagFilter(tag)}
          >
            {tag}
          </OptionButton>
        ))}
        {activeFilter === "carType" && (
          <FilterPopup
            filterType={activeFilter}
            closePopup={closePopup}
            selectedFilters={selectedFilters}
            setSelectedFilters={setSelectedFilters}
          />
        )}
        {activeFilter === "region" && (
          <FilterPopup
            filterType={activeFilter}
            closePopup={closePopup}
            selectedFilters={selectedFilters}
            setSelectedFilters={setSelectedFilters}
          />
        )}
        {activeFilter === "price" && (
          <FilterPopup
            filterType={activeFilter}
            closePopup={closePopup}
            selectedFilters={selectedFilters}
            setSelectedFilters={setSelectedFilters}
          />
        )}
      </FilterSection>
    </>
  );
}

const Overlay = styled.div`
  z-index: 999;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
`;

const FilterSection = styled.section`
  overflow-x: auto;
  display: flex;
  margin-bottom: 20px;
  white-space: nowrap;

  &::-webkit-scrollbar {
    height: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  &::-webkit-scrollbar-thumb {
    background: #888;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }

  scrollbar-width: thin;
  scrollbar-color: #888 #f1f1f1;

  button {
    margin-right: 10px;
    margin-bottom: 10px;
    padding: 5px 10px;
    border: 1px solid #000;
    background: none;
    &.active {
      color: white;
      background-color: #007bff;
      border-color: #0056b3;
    }
    &:last-child {
      margin-right: 0;
    }
  }
`;

const CarTypeButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-right: 10px;
  padding: 5px 10px;
  border: 1px solid #000;
  background: none;
  &.active {
    color: white;
    background-color: #007bff;
    border-color: #0056b3;
  }
  &:last-child {
    margin-right: 0;
  }
`;

const CloseButton = styled.span`
  margin-left: 10px;
  cursor: pointer;
`;

const OptionButton = styled.button`
  width: 100%;
  background: none;
  border: 1px solid #000;
  padding: 5px 10px;
  &.active {
    color: white;
    background-color: #007bff;
    border-color: #0056b3;
  }
`;

export default Filter;
