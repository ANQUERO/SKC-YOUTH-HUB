import React, { useEffect, useState, useMemo } from "react";
import styled from "styled-components";
import useYouth from "@hooks/useYouth";

// Styled Components
const Container = styled.div`
  width: 100%;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
`;

const FilterNav = styled.nav`
  display: flex;
  gap: 12px;
  padding: 16px;
  border-bottom: 1px solid #e5e7eb;
  flex-wrap: wrap;
  justify-content: flex-start;
`;

const FilterButton = styled.button`
  padding: 8px 16px;
  border-radius: 9999px;
  font-weight: 500;
  border: none;
  background-color: ${({ active }) => (active ? "#2563eb" : "#f3f4f6")};
  color: ${({ active }) => (active ? "#fff" : "#374151")};
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${({ active }) => (active ? "#1d4ed8" : "#e5e7eb")};
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Thead = styled.thead`
  background-color: #f3f4f6;
`;

const Th = styled.th`
  text-align: left;
  padding: 12px 16px;
  font-weight: 600;
  color: #374151;
  cursor: pointer;
  border-bottom: 1px solid #d1d5db;

  &:hover {
    background-color: #e5e7eb;
  }
`;

const Td = styled.td`
  padding: 12px 16px;
  border-bottom: 1px solid #e5e7eb;
  color: #374151;
  word-break: break-word;
`;

const Tr = styled.tr`
  background-color: ${({ isEven }) => (isEven ? "#ffffff" : "#f9fafb")};
`;

const ErrorText = styled.p`
  color: #dc2626;
  padding: 16px;
`;

const NoData = styled.div`
  text-align: center;
  padding: 24px;
  color: #6b7280;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
  padding: 16px;
`;

const PageButton = styled.button`
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid #d1d5db;
  background-color: ${({ active }) => (active ? "#2563eb" : "#fff")};
  color: ${({ active }) => (active ? "#fff" : "#374151")};
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

// Component
const YouthTable = () => {
  const { youthData, loading, error, fetchYouths } = useYouth();

  const [sortField, setSortField] = useState("fullName");
  const [sortOrder, setSortOrder] = useState("asc");
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  useEffect(() => {
    fetchYouths();
  }, []);

  const rows = useMemo(() => {
    if (!youthData) return [];

    const youth = youthData.youth || [];
    const name = youthData.name || [];
    const survey = youthData.survey || [];

    let joined = youth.map((item) => {
      const nameEntry = name.find((n) => n.youth_id === item.youth_id);
      const surveyEntry = survey.find((s) => s.youth_id === item.youth_id);

      const fullName = `${nameEntry?.first_name || ""} ${nameEntry?.middle_name || ""} ${nameEntry?.last_name || ""}`.trim();
      const email = item.email;
      const registeredVoter = surveyEntry?.registered_voter ? "Registered" : "Unregistered";
      const nationalVoter = surveyEntry?.registered_national_voter ? "Registered" : "Unregistered";

      return {
        id: item.youth_id,
        fullName,
        email,
        registeredVoter,
        nationalVoter,
      };
    });

    // Apply filter
    if (filter === "registered") {
      joined = joined.filter((y) => y.registeredVoter === "Registered");
    } else if (filter === "unregistered") {
      joined = joined.filter((y) => y.registeredVoter === "Unregistered");
    }

    // Sort logic
    joined.sort((a, b) => {
      const valA = a[sortField]?.toLowerCase?.() || "";
      const valB = b[sortField]?.toLowerCase?.() || "";
      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return joined;
  }, [youthData, sortField, sortOrder, filter]);

  // Pagination logic
  const pageCount = Math.ceil(rows.length / itemsPerPage);
  const paginatedRows = rows.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleSort = (field) => {
    if (field === sortField) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  if (loading) return <p style={{ padding: "16px" }}>Loading youth data...</p>;
  if (error) return <ErrorText>Error: {error}</ErrorText>;

  return (
    <Container>
      <FilterNav>
        {["all", "registered", "unregistered"].map((value) => (
          <FilterButton
            key={value}
            active={filter === value}
            onClick={() => {
              setFilter(value);
              setCurrentPage(1);
            }}
          >
            {value.charAt(0).toUpperCase() + value.slice(1)}
          </FilterButton>
        ))}
      </FilterNav>

      {rows.length === 0 ? (
        <NoData>No youth data available.</NoData>
      ) : (
        <>
          <Table>
            <Thead>
              <tr>
                <Th onClick={() => handleSort("fullName")}>Full Name</Th>
                <Th onClick={() => handleSort("email")}>Email</Th>
                <Th onClick={() => handleSort("registeredVoter")}>Registered Voter</Th>
                <Th onClick={() => handleSort("nationalVoter")}>National Voter</Th>
              </tr>
            </Thead>
            <tbody>
              {paginatedRows.map((youth, index) => (
                <Tr key={youth.id} isEven={index % 2 === 0}>
                  <Td>{youth.fullName}</Td>
                  <Td>{youth.email}</Td>
                  <Td>{youth.registeredVoter}</Td>
                  <Td>{youth.nationalVoter}</Td>
                </Tr>
              ))}
            </tbody>
          </Table>

          <Pagination>
            <PageButton onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1}>
              Prev
            </PageButton>

            {[...Array(pageCount)].map((_, i) => (
              <PageButton
                key={i}
                active={currentPage === i + 1}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </PageButton>
            ))}

            <PageButton onClick={() => setCurrentPage((p) => Math.min(p + 1, pageCount))} disabled={currentPage === pageCount}>
              Next
            </PageButton>
          </Pagination>
        </>
      )}
    </Container>
  );
};

export default YouthTable;
