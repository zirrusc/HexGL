#!/usr/bin/env sh
uglifycss src/css/style.css > build/css/style.css
uglifycss src/css/fonts.css > build/css/fonts.css
uglifycss src/css/reset.mobile.css > build/css/reset.mobile.css
uglifycss src/css/style.mobile.css > build/css/style.mobile.css

cp build/css/style.css src/css/style.min.css
cp build/css/fonts.css src/css/fonts.min.css
cp build/css/reset.mobile.css src/css/reset.mobile.min.css
cp build/css/style.mobile.css src/css/style.mobile.min.css
