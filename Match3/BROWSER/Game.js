Match3.Game = CLASS({
	
	preset : () => {
		return VIEW;
	},
	
	init : (inner) => {
		
		let rootNode = SkyEngine.Node({
			c : [SkyEngine.Image({
				src : Match3.R('bg.jpg')
			}),
			
			// top
			SkyEngine.Node({
				y : -440,
				dom : DIV({
					style : {
						fontSize : 80,
						color : '#000',
						fontWeight : 'bold'
					},
					c : 'Match 3 Game'
				})
			}),
			
			// bottom
			SkyEngine.Node({
				y : 440,
				dom : A({
					href : 'https://github.com/Hanul/SkyEngine',
					target : '_blank',
					c : IMG({
						src : Match3.R('skyengine.png')
					})
				})
			})]
		}).appendTo(SkyEngine.Screen);
		
		REPEAT(7, (i) => {
			REPEAT(7, (j) => {
				rootNode.append(SkyEngine.Rect({
					x : j * 100 - 300,
					y : i * 100 - 300,
					width : 100,
					height : 100,
					color : (i + j) % 2 === 0 ? '#000' : '#333'
				}));
			});
		});
		
		let resizeEvent = EVENT('resize', RAR(() => {
			rootNode.setScale(WIN_HEIGHT() / 1050);
		}));
		
		let tileMap;
		rootNode.append(tileMap = SkyEngine.TileMap({
			x : -300,
			y : -300,
			tileSet : {
				1 : () => {
					return SkyEngine.Tile({
						c : SkyEngine.Image({
							src : Match3.R('snake.png'),
							scale : 0.3
						})
					});
				},
				2 : () => {
					return SkyEngine.Tile({
						c : SkyEngine.Image({
							src : Match3.R('giraffe.png'),
							scale : 0.3
						})
					});
				},
				3 : () => {
					return SkyEngine.Tile({
						c : SkyEngine.Image({
							src : Match3.R('hippo.png'),
							scale : 0.3
						})
					});
				},
				4 : () => {
					return SkyEngine.Tile({
						c : SkyEngine.Image({
							src : Match3.R('monkey.png'),
							scale : 0.3
						})
					});
				},
				5 : () => {
					return SkyEngine.Tile({
						c : SkyEngine.Image({
							src : Match3.R('panda.png'),
							scale : 0.3
						})
					});
				},
				6 : () => {
					return SkyEngine.Tile({
						c : SkyEngine.Image({
							src : Match3.R('penguin.png'),
							scale : 0.3
						})
					});
				},
				7 : () => {
					return SkyEngine.Tile({
						c : SkyEngine.Image({
							src : Match3.R('pig.png'),
							scale : 0.3
						})
					});
				}
			},
			tileWidth : 100,
			tileHeight : 100,
			touchArea : SkyEngine.Rect({
				x : 300,
				y : 300,
				width : 1100,
				height : 1100
			})
		}));
		
		let checkImpossible = () => {
			
			return REPEAT(7, (i) => {
				return REPEAT(7, (j) => {
					
					let nowTileKey = tileMap.getTileKey({
						row : i,
						col : j
					});
					
					if (nowTileKey !== undefined && (
						
						(tileMap.getTileKey({
							row : i - 1,
							col : j
						}) === nowTileKey && (tileMap.getTileKey({
							row : i + 1,
							col : j - 1
						}) === nowTileKey || tileMap.getTileKey({
							row : i + 1,
							col : j + 1
						}) === nowTileKey || tileMap.getTileKey({
							row : i + 2,
							col : j
						}) === nowTileKey)) ||
						
						(tileMap.getTileKey({
							row : i + 1,
							col : j
						}) === nowTileKey && (tileMap.getTileKey({
							row : i - 1,
							col : j - 1
						}) === nowTileKey || tileMap.getTileKey({
							row : i - 1,
							col : j + 1
						}) === nowTileKey || tileMap.getTileKey({
							row : i - 2,
							col : j
						}) === nowTileKey)) ||
						
						(tileMap.getTileKey({
							row : i,
							col : j - 1
						}) === nowTileKey && (tileMap.getTileKey({
							row : i - 1,
							col : j + 1
						}) === nowTileKey || tileMap.getTileKey({
							row : i + 1,
							col : j + 1
						}) === nowTileKey || tileMap.getTileKey({
							row : i,
							col : j + 2
						}) === nowTileKey)) ||
						
						(tileMap.getTileKey({
							row : i,
							col : j + 1
						}) === nowTileKey && (tileMap.getTileKey({
							row : i - 1,
							col : j - 1
						}) === nowTileKey || tileMap.getTileKey({
							row : i + 1,
							col : j - 1
						}) === nowTileKey || tileMap.getTileKey({
							row : i,
							col : j - 2
						}) === nowTileKey))
						
					)) {
						return false;
					}
				});
			});
		};
		
		let checkEmpty = () => {
			
			let isFound;
			
			REPEAT(7, (i) => {
				REPEAT(7, (j) => {
					
					let row = 7 - i - 1;
					
					let nowTileKey = tileMap.getTileKey({
						row : row,
						col : j
					});
					
					if (nowTileKey === undefined) {
						
						isFound = true;
						
						tileMap.moveTile({
							fromRow : row - 1,
							fromCol : j,
							toRow : row,
							toCol : j,
							speed : 1000,
							accel : 1000
						});
					}
				});
			});
			
			REPEAT(7, (i) => {
				
				if (tileMap.getTile({
					row : 0,
					col : i
				}) === undefined) {
					tileMap.addTile({
						row : 0,
						col : i,
						key : RANDOM({
							min : 1,
							max : 7
						})
					});
				}
			});
			
			return isFound;
		};
		
		let checkMatch3 = () => {
			
			let toRemoveTilePositions = [];
			
			REPEAT(7, (i) => {
				REPEAT(7, (j) => {
					
					let nowTileKey = tileMap.getTileKey({
						row : i,
						col : j
					});
					
					if (nowTileKey !== undefined) {
						
						if (tileMap.getTileKey({
							row : i,
							col : j + 1
						}) === nowTileKey && tileMap.getTileKey({
							row : i,
							col : j + 2
						}) === nowTileKey) {
							toRemoveTilePositions.push({
								row : i,
								col : j
							});
							toRemoveTilePositions.push({
								row : i,
								col : j + 1
							});
							toRemoveTilePositions.push({
								row : i,
								col : j + 2
							});
						}
						
						if (tileMap.getTileKey({
							row : i + 1,
							col : j
						}) === nowTileKey && tileMap.getTileKey({
							row : i + 2,
							col : j
						}) === nowTileKey) {
							toRemoveTilePositions.push({
								row : i,
								col : j
							});
							toRemoveTilePositions.push({
								row : i + 1,
								col : j
							});
							toRemoveTilePositions.push({
								row : i + 2,
								col : j
							});
						}
					}
				});
			});
			
			let isFound = false;
			
			EACH(toRemoveTilePositions, (toRemoveTilePosition) => {
				
				let nowTileKey = tileMap.getTileKey({
					row : toRemoveTilePosition.row,
					col : toRemoveTilePosition.col
				});
				
				if (nowTileKey !== undefined) {
					
					isFound = true;
					
					SkyEngine.ParticleSystemOnce({
						x : toRemoveTilePosition.col * tileMap.getTileWidth(),
						y : toRemoveTilePosition.row * tileMap.getTileHeight(),
						zIndex : 1,
						particleFigure : 'circle',
						particleWidth : 30,
						particleHeight : 30,
						particleAccelY : 200,
						particleColor : 'yellow',
						minParticleCount : 6,
						maxParticleCount : 10,
						minParticleLifetime : 0.1,
						maxParticleLifetime : 0.5,
						minParticleDirection : 0,
						maxParticleDirection : 360,
						minParticleSpeed : 50,
						maxParticleSpeed : 500,
						minParticleScale : 0.3,
						maxParticleScale : 1,
						particleScalingSpeed : -1
					}).appendTo(tileMap);
					
					tileMap.removeTile({
						row : toRemoveTilePosition.row,
						col : toRemoveTilePosition.col
					});
				}
			});
			
			return isFound;
		};
		
		let makeTiles = () => {
			
			tileMap.empty();
			
			REPEAT(7, (i) => {
				REPEAT(7, (j) => {
					
					let addTile = () => {
						
						let tileKey = RANDOM({
							min : 1,
							max : 7
						});
						
						if ((tileMap.getTileKey({
							row : i - 2,
							col : j
						}) === tileKey && tileMap.getTileKey({
							row : i - 1,
							col : j
						}) === tileKey) || (tileMap.getTileKey({
							row : i,
							col : j - 2
						}) === tileKey && tileMap.getTileKey({
							row : i,
							col : j - 1
						}) === tileKey)) {
							addTile();
						} else {
							
							tileMap.addTile({
								row : i,
								col : j,
								key : tileKey
							});
						}
					};
					addTile();
				});
			});
			
			// 불가능하면 다시 타일 생성
			if (checkImpossible() === true) {
				makeTiles();
			}
		};
		makeTiles();
		
		let selectedTile;
		let selectedTileRow;
		let selectedTileCol;
		
		tileMap.on('touchstart', (e) => {
			
			selectedTileRow = Math.floor((e.getY() / tileMap.getRealScaleY() + 350) / 100);
			selectedTileCol = Math.floor((e.getX() / tileMap.getRealScaleX() + 350) / 100);
			
			if (selectedTile !== undefined) {
				selectedTile.setAlpha(1);
			}
			
			selectedTile = tileMap.getTile({
				row : selectedTileRow,
				col : selectedTileCol
			});
			
			if (selectedTile !== undefined) {
				selectedTile.setAlpha(0.5);
			}
			
			e.stop();
		});
		
		tileMap.on('touchend', (e) => {
			
			if (selectedTile !== undefined) {
				
				let row = Math.floor((e.getY() / tileMap.getRealScaleY() + 350) / 100);
				let col = Math.floor((e.getX() / tileMap.getRealScaleX() + 350) / 100);
				
				let toRow;
				let toCol;
				
				selectedTile.setAlpha(1);
				
				if (row < selectedTileRow && selectedTileRow > 0) {
					toRow = selectedTileRow - 1;
					toCol = selectedTileCol;
				} else if (row > selectedTileRow && selectedTileRow < 6) {
					toRow = selectedTileRow + 1;
					toCol = selectedTileCol;
				} else if (col < selectedTileCol && selectedTileCol > 0) {
					toRow = selectedTileRow;
					toCol = selectedTileCol - 1;
				} else if (col > selectedTileCol && selectedTileCol < 6) {
					toRow = selectedTileRow;
					toCol = selectedTileCol + 1;
				}
				
				if (toRow !== undefined && toCol !== undefined) {
					
					tileMap.moveTile({
						fromRow : selectedTileRow,
						fromCol : selectedTileCol,
						toRow : toRow,
						toCol : toCol,
						speed : 1000,
						accel : 1000
					});
				}
				
				selectedTile = undefined;
				
				let f = () => {
					
					// 비어있는 타일이 있는 경우 다시 실행
					if (checkEmpty() === true) {
						f();
					}
					
					// 매칭이 되는 경우 다시 실행
					else if (checkMatch3() === true) {
						f();
					}
					
					// 불가능하면 다시 타일 생성
					else if (checkImpossible() === true) {
						makeTiles();
					}
					
					// 원복
					else {
						return true;
					}
				};
				
				// 원복
				if (f() === true) {
					
					if (toRow !== undefined && toCol !== undefined) {
						
						// 한칸 이상 이동할 수 없음
						if ((Math.abs(toRow - selectedTileRow) === 1 && Math.abs(toCol - selectedTileCol) !== 1) || (Math.abs(toRow - selectedTileRow) !== 1 && Math.abs(toCol - selectedTileCol) === 1)) {
							
							tileMap.moveTile({
								fromRow : toRow,
								fromCol : toCol,
								toRow : selectedTileRow,
								toCol : selectedTileCol,
								speed : 1000,
								accel : 1000
							});
						}
					}
				}
			}
		});
		
		inner.on('close', () => {
			rootNode.remove();
			resizeEvent.remove();
		});
	}
});
