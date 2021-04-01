# CaBr2 Search Library

This crate is a collection of providers for substance data and search.

## Available Providers

The following providers are implemented:

### Gestis

- User facing site: <https://gestis.dguv.de/search>, <https://gestis.dguv.de/data?name=005340>
- API: <https://gestis-api.dguv.de/>
  - JSON with XML strings
  - `./src/gestis/xml_parser.rs`: ugly data extractor
- `./contrib/gestis/helper.rs`
  - Helper binary to develop and debug the parser/extractor
  - run with the provided script `./contrib/gestis_helper.sh`
