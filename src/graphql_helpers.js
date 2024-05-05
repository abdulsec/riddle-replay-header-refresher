const getPreviousInterceptedRawRequests = async (host, amount) => {
    const res = await fetch("http://127.0.0.1:8080/graphql", {
        headers: {
            authorization: "Bearer " + JSON.parse(localStorage.getItem("CAIDO_AUTHENTICATION")).accessToken,
        },
        body: JSON.stringify({
            operationName: "interceptEntries",
            query: `
          query interceptEntries(
            $after: String
            $first: Int
            $before: String
            $last: Int
            $order: InterceptEntryOrderInput
            $filter: FilterClauseInterceptEntryInput
            $scopeId: ID
          ) {
            interceptEntries(
              after: $after
              first: $first
              before: $before
              last: $last
              order: $order
              filter: $filter
              scopeId: $scopeId
            ) {
              edges {
                node {
                  request {
                    host
                    raw
                  }
                }
              }
              snapshot
              pageInfo {
                hasPreviousPage
                hasNextPage
                startCursor
                endCursor
              }
            }
          }
        `,
            variables: {
                last: amount,
                filter: {
                    AND: [{ request: { host: { operator: "CONT", value: host } } }],
                },
            },
        }),
        method: "POST",
        mode: "cors",
        credentials: "include",
    });
    const j_res = await res.json();
    return await j_res.data.interceptEntries.edges.map((edge) => {
        const base64 = edge.node.request.raw;
        const decoded = atob(base64);
        return {
            host: edge.node.request.host,
            raw: decoded,
        };
    });
};

export { getPreviousInterceptedRawRequests };
