import { buildTheme, ICheckboxTheme, ITextTheme, ITheme, mergeTheme, mergeThemePartial, ThemeMap } from '@kibalabs/ui-react';

export const buildHookeTheme = (): ITheme => {
  const baseTheme = buildTheme();
  const textThemes: ThemeMap<ITextTheme> = {
    ...baseTheme.texts,
    default: mergeTheme(baseTheme.texts.default, {
      'font-family': '"Coinbase-Display"',
      'font-weight': '400',
    }),
    header1: {
      'font-weight': '500',
      color: '$colors.brandPrimary',
    },
    navBarLogo: {
      'font-weight': '800',
      color: 'white',
    },
    light: {
      color: '$colors.backgroundDarker50',
    },
    warning: {
      color: '$colors.warning',
    },
    header3: {
      'font-size': '1em',
      'font-weight': 'bolder',
    },
    header4: {
      'font-size': '1em',
      'font-weight': 'normal',
      'text-decoration': 'underline',
    },
  };
  const theme = buildTheme({
    colors: {
      background: '#000',
      brandPrimary: '#0052FF',
      warning: '#cf9f04',
    },
    dimensions: {
      borderRadius: '0.2em',
    },
    fonts: {
      main: {
        url: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,300;1,400;1,500;1,600;1,700&display=swap',
      },
    },
    texts: textThemes,
    dividers: {
      light: {
        color: 'var(--color-background-light25)',
      },
    },
    buttons: {
      destructive: {
        normal: {
          default: {
            background: {
              'background-color': '$colors.error',
            },
            text: {
              color: 'white',
            },
          },
        },
      },
      go: {
        normal: {
          default: {
            background: {
              'background-color': '$colors.brandPrimary',
              'border-radius': '50%',
            },
            text: {
              color: 'white',
              'font-size': '4em',
              'font-weight': 'bold',
            },
          },
        },
      },
    },
    pills: {
      default: {
        background: {
          padding: `${baseTheme.dimensions.paddingNarrow} ${baseTheme.dimensions.paddingWide}`,
          'background-color': '$colors.backgroundDark05',
          'border-width': '0',
        },
        text: {
          'font-size': '0.7em',
        },
      },
      small: {
        background: {
          padding: `0 ${baseTheme.dimensions.paddingNarrow}`,
        },
        text: {
          'font-size': '0.5em',
        },
      },
      error: {
        background: {
          'background-color': '$colors.errorClear90',
        },
        text: {
          color: '$colors.error',
        },
      },
    },
    links: {
      note: {
        normal: {
          default: {
            text: {
              'font-size': baseTheme.texts.note['font-size'],
            },
          },
        },
      },
      large: {
        normal: {
          default: {
            text: {
              'font-size': baseTheme.texts.large['font-size'],
            },
          },
        },
      },
      plain: {
        normal: {
          default: {
            text: {
              'text-decoration': 'none',
            },
          },
        },
      },
    },
    iconButtons: {
      default: {
        normal: {
          default: {
            background: {
              'border-width': 0,
            },
          },
        },
      },
      primary: {
        disabled: {
          default: {
            background: {
              'background-color': '$colors.backgroundLight10',
              'border-width': 0,
            // opacity: '0.2',
            },
          },
        },
      },
      tertiary: {
        normal: {
          default: {
            text: {
              color: '$colors.textClear50',
            },
          },
        },
      },
      large: {
        normal: {
          default: {
            background: {
              padding: `${baseTheme.dimensions.paddingWide} ${baseTheme.dimensions.paddingWide}`,
            },
          },
        },
      },
      chatInputSubmit: {
        normal: {
          default: {
            background: {
              'border-radius': '0',
            },
          },
        },
      },
    },
    inputWrappers: {
      chatInput: {
        normal: {
          default: {
            background: {
              'background-color': 'black',
              'border-width': '1px 0 0 0',
              'border-radius': '0',
              'caret-color': '$colors.brandPrimary',
              'caret-width': '0.5em',
              'border-color': '$colors.textClear80',
              // 'padding': `${baseTheme.dimensions.paddingWide} ${baseTheme.dimensions.paddingWide2}`,
              padding: '0',
            },
          },
          focus: {
            background: {
              'border-color': '$colors.brandPrimaryClear25',
            },
          },
        },
      },
    },
    checkboxes: {
      default: {
        disabled: {
          default: {
            checkBackground: {
              'background-color': (baseTheme.checkboxes as ThemeMap<ICheckboxTheme>).default.normal.default.checkBackground['background-color'],
              opacity: '0.2',
            },
            text: {
              color: '$colors.textClear80',
            },
          },
        },
      },
    },
    boxes: {
      task: mergeThemePartial(baseTheme.boxes.card, baseTheme.boxes.unmargined, baseTheme.boxes.unpadded, {
        'background-color': 'white',
        'border-width': '0',
      }),
      empty: {
        'border-radius': '0',
      },
      navBar: {
        'border-radius': '0',
        'background-color': '$colors.background',
        'border-width': '0 0 1px 0',
        'border-color': '$colors.backgroundLight10',
        padding: baseTheme.dimensions.padding,
        position: 'sticky',
        top: '0',
      },
      navBarMenu: {
        'background-color': '$colors.background',
        'border-radius': '0',
        padding: '0',
        position: 'sticky',
        top: '0',
      },
      navBarBottomExtension: {
        'background-color': '$colors.background',
        'border-width': '0 0 1px 0',
        'border-color': '$colors.backgroundLight10',
      },
      chatMessage: {
        padding: '1em 1.5em',
      },
      chatMessageUser: {
        'background-color': '$colors.backgroundLight10',
        'border-radius': '0.99em 0.99em 0 0.99em',
        'align-self': 'flex-end',
      },
      chatMessageBot: {
        'background-color': 'transparent',
      },
    },
    listItems: {
      card: {
        normal: {
          default: {
            background: baseTheme.boxes.card,
          },
          hover: {
            background: {
              'background-color': '$colors.brandPrimaryClear95',
            },
          },
        },
        selected: {
          default: {
            background: {
              'background-color': '$colors.brandPrimaryClear90',
            },
          },
        },
      },
    },
    portals: {
      unpadded: {
        background: {
          padding: '0',
        },
      },
    },
  });
  return theme;
};
