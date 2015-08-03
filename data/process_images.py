from PIL import Image
import glob
import os.path
import re
import json

def get_frame(path):
	return int(path.rpartition('.')[0].rpartition('\\')[2])

for character in glob.glob('.\\raw\\*'):

	character_name = character.rpartition('\\')[2]

	for move in glob.glob(character + '\\*'):
		move_name = move.rpartition('\\')[2]

		if not os.path.exists(character_name):
			os.makedirs(character_name)
		hitbox_file = open(character_name + '\\' + move_name + '.json', 'w')

		# {left_bound, bottom_bound, frame_data}
		hitbox_file.write('characters.' + character_name + '.animations.' + move_name + '=')

		# set the number of frames in the animation based on the .txt filename
		data = [0] * get_frame(glob.glob(move + '\\*.txt')[0])

		# process each image in the animation folder
		for image_path in glob.glob(move + '\\*.png'):
			frame = get_frame(image_path)
			img = Image.open(image_path).convert('RGB')
			pixels = img.load()

			# calculate bounds of valuable data
			left_bound = img.size[0]
			right_bound = 0
			top_bound = img.size[1]
			bottom_bound = 0
			for i in range(img.size[0]):
				for j in range(img.size[1]):
					if pixels[i,j][0] != pixels[i,j][1]:
						if i < left_bound:
							left_bound = i
						if i > right_bound:
							right_bound = i + 1
						if j < top_bound:
							top_bound = j
						if j > bottom_bound:
							bottom_bound = j + 1

			data[frame] = {'left_bound':left_bound,
							'top_bound':top_bound,
							'frame_data':[None] * (right_bound - left_bound)
						}

			for i in range(left_bound, right_bound):
				data[frame]['frame_data'][i - left_bound] = [None] * (bottom_bound - top_bound)
				for j in range(top_bound, bottom_bound):
					if pixels[i,j][0] == pixels[i,j][1]:
						data[frame]['frame_data'][i - left_bound][j - top_bound] = 0
					elif pixels[i,j][2] > pixels[i,j][0] and pixels[i,j][1] > pixels[i,j][0]:
						data[frame]['frame_data'][i - left_bound][j - top_bound] = 0
					else:
						data[frame]['frame_data'][i - left_bound][j - top_bound] = 1

		hitbox_file.write(json.dumps(data, separators=(',',':')))
		hitbox_file.write(';')
		hitbox_file.close()
