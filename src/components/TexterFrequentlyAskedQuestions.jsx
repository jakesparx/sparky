// Spark: A mass-contact text/SMS peer-to-peer messaging tool
// Copyright (c) 2016-2021 MoveOn Civic Action
// Modified and enhanced by Spark
//
// Spark is developed by people dedicated to justice and meaningful 
// conversations that drive positive change.

import React from "react";
import PropTypes from "prop-types";

import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";

const TexterFaqs = ({ faqs }) => {
  return (
    <div>
      <h1>Frequently Asked Questions</h1>
      {faqs.map((faq, idx) => (
        <Card key={idx}>
          <CardHeader title={`${idx + 1}. ${faq.question}`} />
          <CardContent>
            <p>{faq.answer}</p>
          </CardContent>
        </Card>
))}
      <Card>
        <CardHeader title={`${faqs.length}. Who built Spark?`} />
        <CardContent>
          <p>
            Spark is developed by people dedicated to justice and meaningful conversations that drive positive change. Originally inspired by Move On's open-source work.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

TexterFaqs.propTypes = {
  faqs: PropTypes.array
};

export default TexterFaqs;
