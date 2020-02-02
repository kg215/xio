import React from "react";
import dva from "dva";

import common from "../models/common";
import models from "../models";
import Web from './Web';
require("../asset/sass/common.scss");
require("../asset/sass/style.scss");

const app = dva();

app.model(models.web);
app.model(common);

app.router(()=><Web />);

app.start('#root');