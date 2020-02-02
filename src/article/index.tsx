import React from "react";
import dva from "dva";

import article from "../models/article";
import common from "../models/common";
import Routes from "./Routes";

require("../asset/sass/common.scss");
require("../asset/sass/article.scss");

const app = dva();

app.model(article);
app.model(common);

app.router(()=><Routes />);

app.start("#root");
