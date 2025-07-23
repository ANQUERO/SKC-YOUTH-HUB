import React, { useEffect, useState, useMemo } from "react";
import styled from "styled-components";
import useYouth from "@hooks/useYouth";

const YouthPage = () => {
    const { youthData, fetchYouths } = useYouth();
    const [selected, setSelected] = useState([]);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");
    const [genderFilter, setGenderFilter] = useState("all");
    const [purokFilter, setPurokFilter] = useState("all");
    const [sortKey, setSortKey] = useState("name");
    const [sortAsc, setSortAsc] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const perPage = 10;

    useEffect(() => {
        fetchYouths();
    }, []);

    const purokList = useMemo(() => {
        const allPuroks = youthData?.purok?.map((p) => p.name).filter(Boolean) || [];
        return [...new Set(allPuroks)];
    }, [youthData]);

    const rows = useMemo(() => {
        if (!youthData?.youth) return [];

        return youthData.youth.map((y) => {
            const id = y.youth_id;
            const n = youthData.name?.find((x) => x.youth_id === id);
            const s = youthData.registered_voter?.find((x) => x.youth_id === id);
            const g = youthData.gender?.find((x) => x.youth_id === id);
            const p = youthData.purok?.find((x) => x.youth_id === id);

            return {
                id,
                name: `${n?.first_name || ""} ${n?.middle_name || ""} ${n?.last_name || ""}`.trim(),
                email: y.email,
                registered: s?.registered_voter === "yes",
                gender: g?.gender || "N/A",
                purok: p?.name || "N/A",
            };
        });
    }, [youthData]);

    const filtered = useMemo(() => {
        let r = [...rows];

        if (search) {
            r = r.filter((y) => y.name.toLowerCase().includes(search.toLowerCase()));
        }

        if (filter === "registered") {
            r = r.filter((y) => y.registered);
        } else if (filter === "unregistered") {
            r = r.filter((y) => !y.registered);
        }

        if (genderFilter !== "all") {
            r = r.filter((y) => y.gender.toLowerCase() === genderFilter);
        }

        if (purokFilter !== "all") {
            r = r.filter((y) => y.purok === purokFilter);
        }

        r.sort((a, b) => {
            const aVal = a[sortKey];
            const bVal = b[sortKey];
            if (aVal < bVal) return sortAsc ? -1 : 1;
            if (aVal > bVal) return sortAsc ? 1 : -1;
            return 0;
        });

        return r;
    }, [rows, filter, genderFilter, purokFilter, search, sortKey, sortAsc]);

    const totalPages = Math.ceil(filtered.length / perPage);
    const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

    const handleSelect = (id) => {
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    const handleSort = (key) => {
        if (key === sortKey) {
            setSortAsc(!sortAsc);
        } else {
            setSortKey(key);
            setSortAsc(true);
        }
    };

    return (
        <Layout>
            <Sidebar>
                <FilterTitle>Status</FilterTitle>
                <FilterBtn onClick={() => setFilter("all")} $active={filter === "all"}>All</FilterBtn>
                <FilterBtn onClick={() => setFilter("registered")} $active={filter === "registered"}>Registered</FilterBtn>
                <FilterBtn onClick={() => setFilter("unregistered")} $active={filter === "unregistered"}>Unregistered</FilterBtn>

                <FilterTitle>Gender</FilterTitle>
                <FilterBtn onClick={() => setGenderFilter("all")} $active={genderFilter === "all"}>All</FilterBtn>
                <FilterBtn onClick={() => setGenderFilter("male")} $active={genderFilter === "male"}>Male</FilterBtn>
                <FilterBtn onClick={() => setGenderFilter("female")} $active={genderFilter === "female"}>Female</FilterBtn>

                <FilterTitle>Purok</FilterTitle>
                <FilterBtn onClick={() => setPurokFilter("all")} $active={purokFilter === "all"}>All</FilterBtn>
                {purokList.map((p) => (
                    <FilterBtn key={p} onClick={() => setPurokFilter(p)} $active={purokFilter === p}>{p}</FilterBtn>
                ))}
            </Sidebar>

            <Main>
                <TopBar>
                    <SearchInput
                        placeholder="Search youth..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <ActionGroup>
                        <ActionBtn $primary onClick={() => alert("Add Youth")}>+ Add Youth</ActionBtn>
                        <ActionBtn onClick={() => alert("Export")}>Export</ActionBtn>
                        <ActionBtn disabled={selected.length === 0} onClick={() => alert("Delete selected")}>Delete</ActionBtn>
                    </ActionGroup>
                </TopBar>

                <TableWrapper>
                    <StyledTable>
                        <thead>
                            <tr>
                                <th>
                                    <input
                                        type="checkbox"
                                        onChange={(e) =>
                                            setSelected(
                                                e.target.checked ? paginated.map((y) => y.id) : []
                                            )
                                        }
                                        checked={
                                            selected.length === paginated.length &&
                                            paginated.length > 0
                                        }
                                    />
                                </th>
                                <th onClick={() => handleSort("name")}>Name {sortKey === "name" && (sortAsc ? "↑" : "↓")}</th>
                                <th onClick={() => handleSort("email")}>Email {sortKey === "email" && (sortAsc ? "↑" : "↓")}</th>
                                <th onClick={() => handleSort("registered")}>Voting Status {sortKey === "registered" && (sortAsc ? "↑" : "↓")}</th>
                                <th onClick={() => handleSort("gender")}>Gender {sortKey === "gender" && (sortAsc ? "↑" : "↓")}</th>
                                <th onClick={() => handleSort("purok")}>Purok {sortKey === "purok" && (sortAsc ? "↑" : "↓")}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginated.map((y) => (
                                <tr key={y.id}>
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={selected.includes(y.id)}
                                            onChange={() => handleSelect(y.id)}
                                        />
                                    </td>
                                    <td>{y.name}</td>
                                    <td>{y.email}</td>
                                    <td>{y.registered ? "Yes" : "No"}</td>
                                    <td>{y.gender}</td>
                                    <td>{y.purok}</td>
                                </tr>
                            ))}
                            {paginated.length === 0 && (
                                <tr>
                                    <td colSpan="6">No results found.</td>
                                </tr>
                            )}
                        </tbody>
                    </StyledTable>
                </TableWrapper>

                <Pagination>
                    {Array.from({ length: totalPages }, (_, i) => (
                        <PageBtn
                            key={i}
                            onClick={() => setCurrentPage(i + 1)}
                            className={currentPage === i + 1 ? "active" : ""}
                        >
                            {i + 1}
                        </PageBtn>
                    ))}
                </Pagination>
            </Main>
        </Layout>
    );
};

export default YouthPage;



const Layout = styled.div`
    display: flex;
    min-height: 100vh;
    background: #f5f7fa;
`;

const Sidebar = styled.div`
    width: 15rem;
    padding: 1.5rem;
    background: #fff;
    border-right: 1px solid #ddd;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
`;

const Main = styled.div`
    flex: 1;
    padding: 1rem;
`;

const TopBar = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    flex-wrap: wrap;
    gap: 1rem;
`;

const ActionGroup = styled.div`
    display: flex;
    gap: 0.5rem;
`;

const ActionBtn = styled.button`
    background: ${(p) => (p.$primary ? "#007bff" : "#eee")};
    color: ${(p) => (p.$primary ? "white" : "#333")};
    padding: 0.6rem 1rem;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    opacity: ${(p) => (p.disabled ? 0.5 : 1)};
    pointer-events: ${(p) => (p.disabled ? "none" : "auto")};
    font-weight: 500;

    &:hover {
        background: ${(p) => (p.$primary ? "#0056b3" : "#ddd")};
    }
`;

const SearchInput = styled.input`
    padding: 0.5rem 1rem;
    border: 1px solid #ccc;
    border-radius: 6px;
`;

const FilterTitle = styled.div`
    font-weight: 600;
    margin-top: 1rem;
`;

const FilterBtn = styled.button`
    background: ${(p) => (p.$active ? "#007bff" : "white")};
    color: ${(p) => (p.$active ? "white" : "#333")};
    border: 1px solid ${(p) => (p.$active ? "#007bff" : "#ccc")};
    padding: 0.4rem 0.6rem;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 0.3rem;
    text-align: left;
`;

const TableWrapper = styled.div`
    width: 100%;
    overflow-x: auto;
    background: white;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    padding-bottom: 1rem;

    &::-webkit-scrollbar {
        height: 8px;
    }

    &::-webkit-scrollbar-thumb {
        background-color: #ccc;
        border-radius: 4px;
    }

    &::-webkit-scrollbar-track {
        background-color: #f1f1f1;
    }
`;

const StyledTable = styled.table`
    width: 100%;
    border-collapse: collapse;
    min-width: 800px;

    th, td {
        padding: 0.75rem 1rem;
        border-bottom: 1px solid #eee;
        text-align: left;
        white-space: nowrap;
    }

    th {
        background: #f8f8f8;
        cursor: pointer;
        font-weight: 600;
        user-select: none;
    }

    tr:hover td {
        background: #f1f9ff;
    }
`;

const Pagination = styled.div`
    margin-top: 1.5rem;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 0.3rem;
`;

const PageBtn = styled.button`
    padding: 0.4rem 0.8rem;
    border: 1px solid #ccc;
    background: white;
    border-radius: 4px;
    cursor: pointer;

    &.active {
        background: #007bff;
        color: white;
    }
`;
