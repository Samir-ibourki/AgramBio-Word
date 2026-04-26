const query = `
  {
    __schema {
      types {
        kind
        name
        possibleTypes {
          name
        }
      }
    }
  }
`;

async function test() {
  const r = await fetch('http://agrambio.local/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query })
  });
  const result = await r.json();
  const possibleTypes = {};
  result.data.__schema.types.forEach(supertype => {
    if (supertype.possibleTypes) {
      possibleTypes[supertype.name] = supertype.possibleTypes.map(subtype => subtype.name);
    }
  });
  console.log(JSON.stringify(possibleTypes, null, 2));
}
test();
