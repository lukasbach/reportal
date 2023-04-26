import React from "react";
import { FieldType, ListField } from "./types";
import { cellRenderers } from "./cell-renderers";
import { GhUserName } from "../../components/common/gh-user-name";
import { resolveRecursiveSubitem } from "../../utils";

export class ListFieldBuilder {
  #field: ListField;

  constructor(key: string, name: string) {
    this.#field = {
      key,
      name,
      type: FieldType.Text,
    };
  }

  static from(key: string, name: string) {
    return new ListFieldBuilder(key, name);
  }

  get f() {
    return this.#field;
  }

  text() {
    return this;
  }

  repoName(avatarPath?: string) {
    this.withRenderer((value: string, data: any) =>
      avatarPath ? <GhUserName text={value} avatar={resolveRecursiveSubitem(data, avatarPath)} /> : value
    );
    return this;
  }

  user(login = "login", avatarUrl = "avatarUrl") {
    this.#field.type = FieldType.User;
    this.#field.renderCell = cellRenderers.author(this.#field.key, login, avatarUrl);
    return this;
  }

  issueTitle() {
    this.#field.renderCell = cellRenderers.issueTitle();
    return this;
  }

  issueState() {
    this.#field.renderCell = cellRenderers.issueState();
    return this;
  }

  date() {
    this.#field.type = FieldType.Date;
    this.#field.renderCell = cellRenderers.date();
    return this;
  }

  url() {
    this.#field.type = FieldType.Text;
    return this;
  }

  number() {
    this.#field.type = FieldType.Number;
    return this;
  }

  diskUsage() {
    this.#field.type = FieldType.Text;
    this.#field.renderCell = cellRenderers.diskUsage();
    return this;
  }

  boolean() {
    this.#field.renderCell = cellRenderers.boolean();
    this.#field.suggestions = ["true", "false"];
    this.#field.type = FieldType.Boolean;
    return this;
  }

  enum(...options: string[]) {
    this.#field.suggestions = options;
    this.#field.type = FieldType.Enum;
    return this;
  }

  emoji() {
    this.#field.type = FieldType.Text;
    this.#field.renderCell = (value) => <div dangerouslySetInnerHTML={{ __html: value }} />;
    return this;
  }

  withRenderer(renderCell: ListField["renderCell"]) {
    this.#field.renderCell = renderCell;
    return this;
  }

  withDescription(description: string) {
    this.#field.description = description;
    return this;
  }

  multiple() {
    this.#field.multiple = true;
    return this;
  }
}
