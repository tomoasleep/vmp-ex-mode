// @flow
import { AnyComponent, Component, ComponentConstructor, VNode } from 'preact';
import { Store, Dispatch, ActionCreator } from 'redux';

declare module "preact-redux" {
  declare type MapStateToProps<State, A, OwnProps> = (state: State, ownProps: OwnProps) => A;
  declare type MapDispatchToProps<A, OwnProps> = (dispatch: any, ownProps: OwnProps) => A;

  declare type Connect2<State, OwnProps, A, B> =
  (mapStateToProps: MapStateToProps<State, A, OwnProps>, mapDispatchToProps: MapDispatchToProps<B, OwnProps>) => (Component<A & B>) => Component<OwnProps>;

  // declare export function connect<State, OwnProps, A, B>(
  //   mapStateToProps: MapStateToProps<State, A, OwnProps>, mapDispatchToProps: MapDispatchToProps<B, OwnProps>
  // ): (Component<A & B>) => Component<OwnProps>;

  declare export var connect: Connect2<*, *, *, *>;

}
