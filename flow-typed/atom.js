// @flow

declare module "atom" {
  declare interface DisposableItem {
    dispose(): void;
  }

  declare export class Disposable {
    static isDisposable(Object): boolean;
    constructor(() => mixed): Disposable;
    dispose(): void;
  }

  declare export class CompositeDisposable {
    constructor(): CompositeDisposable;
    dispose(): void;
    add(DisposableItem): void;
    remove(DisposableItem): void;
    delete(DisposableItem): void;
    clear(): void;
  }

  declare interface ElementContainer {
    getElement(): HTMLElement;
  }

  declare type Item = HTMLElement | ElementContainer | { element: HTMLElement } | Function;

  declare type Panel = any;
  declare type PanelOptions = {
    item: Item,
    visible?: boolean,
    priority?: number,
  };

  declare class Workspace {
    addRightPanel(PanelOptions): Panel;
    getRightPanels(): Panel;

    open(Item | string): any;
    toggle(Item | string): any;
  }

  declare export class Emitter {
    constructor(): Emitter;
    clear(): void;
    dispose(): void;
    on(string, (any) => mixed, ?boolean): Disposable;
    once(string, (any) => mixed, ?boolean): Disposable;
    preempt(string, (any) => mixed): Disposable;
    on(string, (any) => mixed): void;
    emit(string, any): void;
    getEventNames(): Array<string>;
    listenerCountForEventName(string): number;
    getTotalListenerCount(): number;
  }

  declare class Notification {
    onDidDismiss(() => mixed): DisposableItem;
    onDidDisplay(() => mixed): DisposableItem;

    getType(): string;
    getMessage(): string;
    getDetail(): string;
    dismiss(): void;
    isDismissed(): boolean;
  }

  declare type NotificationOptions = {
    buttons?: Array<any>,
    description?: string,
    detail?: string,
    icon?: string,
    dismissable?: boolean
  }

  declare class NotificationManager {

    onDidAddNotification((Notification) => any): DisposableItem;
    getNotifications(): Array<Notification>;

    addSuccess(string, NotificationOptions): void;
    addInfo(string, NotificationOptions): void;
    addWarning(string, NotificationOptions): void;
    addError(string, NotificationOptions): void;
    addFatalError(string, NotificationOptions): void;
  }

  declare interface Tile {
    getPriority(): number;
    getItem(): any;
    destroy(): void;
  }

  declare interface StatusBar {
    addLeftTile({ item: Item, priority?: number }): Tile;
    addRightTile({ item: Item, priority?: number }): Tile;
    getLeftTiles(): Array<Tile>;
    getRightTiles(): Array<Tile>;
  }

  declare interface Command {
    name: string;
    displayName: string;
  }

  declare class CommandRegistry {
    add(target: string | HTMLElement, commandName: string, callback: (Event) => mixed): DisposableItem;
    findCommands({ target: HTMLElement }): Array<Command>;
    dispatch(target: EventTarget, commandName: string): void;

    onWillDispatch(callback: (Event) => mixed): DisposableItem;
    onDidDispatch(callback: (Event) => mixed): DisposableItem;
  }

  declare type ModelProvider = any;
  declare export type ViewRegistry = {
    addViewProvider: (ModelProvider, (Object) => ?HTMLElement) => Disposable;
    getView: (Object) => ?HTMLElement;
  }

  declare export type AtomEnvironment = {
    commands: CommandRegistry;
    notifications: NotificationManager;
    workspace: Workspace;
    views: ViewRegistry;
  }

  declare interface SerializedState {
    deserializer: string;
  }
  declare export interface PackageConfiguration<State> {
    initialize?: (State) => void;
    activateConfig?: () => void;
    activate?: (State) => void;
    serialize?: () => SerializedState;
    deactivate?: () => void;
    config?: Object;
  }

  declare export var Notification: Notification;
  declare export var BufferedNodeProcess: any;
  declare export var BufferedProcess: any;
  declare export var GitRepository: any;
  declare export var TextBuffer: any;
  declare export var Point: any;
  declare export var Range: any;
  declare export var File: any;
  declare export var Directory: any;
  declare export var Task: any;
  declare export var TextEditor: any;

}
