## [v0.5.1](https://github.com/Calciumdibromid/CaBr2/releases/tag/v0.5.1) - 2022-02-02

* BUGFIXES
  * Add migration of config in local storage (#1127)

## [v0.5.0](https://github.com/Calciumdibromid/CaBr2/releases/tag/v0.5.0) - 2022-02-02

* FEATURES
  * Introduce NGXS (#1048)
* ENHANCEMENTS
  * Destroy all Observables and fix bad code (#1118)
  * Move search icon to the beginning (#1117)
  * Change message for gestis disclaimer (#1116)
  * Replace config-model hack with ngxs approach (#1111)
  * Remove unnecessary transloco object (#1106)
  * Gestis parser rewrite (#1060)
  * Add tests (#1053)
  * New error handling in crates (#1051)
  * Rename ureq to request in config (#1041)
  * Feature/airbnb style guide (#1037)
  * Wrap RwLock to simplify code (#1028)
  * Remove version reqirement from config handler (#1023)
  * Restructure project (#1018)
* BUGFIXES
  * Fix logging message when saving file (#1110)
  * Print all log messages in tauri also via `console.*` methods (#1109)
  * Fix log level filter (#1105)
  * New error implementation for serialization (#1104)
  * Fix unit translation (#1096)
  * Add .gitattributes file to force lf on checkout (#1044)
* BUILD
  * Update contrib scripts (#1095)
  * Fix wasm-bindgen (#1077)
  * Fix clippy in ci (#1076)
  * Migrate angular to 13 (#1031)
  * Bump rust edition to 2021 (#1020)
* DOCS
  * Improve READMEs and IntelliJ support (#1036)
  * Update Develop and Build instructions (#826)
* MISC

## [v0.4.1](https://github.com/Calciumdibromid/CaBr2/releases/tag/v0.4.1) - 2022-01-15

* ENHANCEMENTS
  * Add signature and location, date to preview and template (#1009)
  * Add error message to pdf dialog (#1007)
  * Some style improvements (#1006)
  * Add disclaimer to provider tab (#979)
  * Reduce timeout of consent dialog to 5 seconds (#974)
* BUGFIXES
  * Fix frontend custom unit (#1004)
  * Fix molar mass header in preview (#933)
  * Fix transloco dependency (#860)
* TRANSLATION
  * Update translations (#1008)
* MISC
  * Update wasm dependencies (#1003)
  * Add codespell into backend & frontend pipeline (#990)

## [v0.4.0](https://github.com/Calciumdibromid/CaBr2/releases/tag/v0.4.0) - 2021-09-20

* FEATURES
  * Add angular splashscreen on app loading (#802)
  * WASM rewrite (#649)
  * Drag and drop feature to change order of the second sheet (#543)
  * Add reset button to edit substance data dialog (#520)
  * Add provider tabs (#489)
  * Add export and save buttons below preview (#486)
  * Add drag and drop to substance data (#392)
* ENHANCEMENTS
  * Add tooltips to navbar icons (#815)
  * Embed google fonts (#813)
  * Delete prompts (#803)
  * Feature/replace selfmade localization with transloco (#801)
  * Improve webserver (#756)
  * Rewrite to `async` Rust (#651)
  * Webapp rewrite (#646)
  * Migrate to Angular 12 (#544)
  * Rewrite of handlers (#541)
  * Fix order of ghs symbols (#530)
  * Mov image sanitizing to global model (#516)
  * Refactor plugins into features (#507)
  * Remove validator substancedata amount form (#487)
  * Add dialog when some data is invalid in a substance-edit-dialog (#485)
  * Refactor unit model and added new units (#465)
  * Change simple load animation to CaBr2 load animation (#442)
  * Bump ureq to 2.1.0 (#398)
* BUGFIXES
  * CI: update-translations task commit & push to new branch (#560)
  * Fix localization (#531)
  * Fix correct clearing for header (#527)
  * Fix dev server and tauri build (#521)
  * Fix units in preview (#504)
  * Fix provider names in preview and pdf (#405)
* TESTING
  * Add tool to develop and debug gestis parser (#406)
* TRANSLATION
  * Update Translation 2021-09-20 (#821)
  * Add languages above dialog blocks (#648)
  * Add CI Task to update translations on push to develop (#466)
  * Add update script & example config (#368)
* BUILD
  * Smaller ui builds (#814)
  * Delete "format default strings" from pull translation script (#804)
  * Refactor Navbar (#775)
  * Fix clippy warnings (#718)
  * Fix release build (#647)
  * SpeedUp Backend CI Again (#627)
  * Fix frontend build (#626)
  * Make pipeline faster (#529)
  * Fix rust ci (#391)
* DOCS
  * Add Changelog Tool Config (#798)
