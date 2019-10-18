import React from "react";
import { storiesOf } from "@storybook/react";
import { withKnobs } from "@storybook/addon-knobs/react";
import withReadme from "storybook-readme/with-readme";
import Readme from "./README.md";
import HelpButton from ".";
import Section from "../../../.storybook/decorators/section";
import { Text } from "../text";
import Link from "../link";
import styled from "styled-components";

const IconButtons = styled.div`
  margin-top: 150px;
  margin-left: 70px;
  display: flex;

  .icon-button {
    margin-left: 10px;
  }
`;

storiesOf("Components|Buttons", module)
  .addDecorator(withKnobs)
  .addDecorator(withReadme(Readme))
  .add("help button", () => {
    return (
      <Section>
        <IconButtons>
          <HelpButton
            tooltipContent={
              <Text.Body fontSize={13}>
                Paste you tooltip content here
              </Text.Body>
            }
          />
          <HelpButton
            tooltipContent={
              <Text.Body>
                You tooltip content with{" "}
                <Link
                  isHovered={true}
                  href="http://localhost:6006/?path=/story/components-buttons--help-button"
                >
                  link
                </Link>
              </Text.Body>
            }
          />
          <HelpButton
            tooltipContent={
              <>
                <p>You can put every thing here</p>
                <ul>
                  <li>Word</li>
                  <li>Chart</li>
                  <li>Else</li>
                </ul>
              </>
            }
          />
        </IconButtons>
      </Section>
    );
  });
